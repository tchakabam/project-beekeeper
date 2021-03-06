/**
 * Copyright 2018 Novage LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as Debug from 'debug';

import {EventEmitter} from 'eventemitter3';
import {HttpDownloadQueue} from './http-download-queue';
import {BKPeerAgent} from './peer-agent';
import {BandwidthEstimator} from './bandwidth-estimator';
import { PeerTransportFilterFactory, DefaultPeerTransportFilter } from './peer-transport';

import { BKResource, BKResourceMapData, BKResourceStatus, BKResourceTransportMode } from './bk-resource';

import { getPerfNow } from './perf-now';
import { BKPeer } from './peer';

const getBrowserRtc = require('get-browser-rtc');

const rtcDefaultConfig: RTCConfiguration = require('simple-peer').config;

const trackerDefaultAnounce = [
    'wss://tracker.btorrent.xyz/',
    'wss://tracker.openwebtorrent.com/'
];

export type BKAccessProxySettings = {
    /**
     * Max WebRTC message size. 64KiB - 1B should work with most of recent browsers. Set it to 16KiB for older browsers support.
     */
    webRtcMaxMessageSize: number;

    /**
     * Timeout to download a segment from a peer. If exceeded the peer is dropped.
     */
    p2pSegmentDownloadTimeout: number;

    /**
     * Torrent trackers (announcers) to use.
     */
    trackerAnnounce: string[];

    /**
     * An RTCConfiguration dictionary providing options to configure WebRTC connections.
     */
    rtcConfig: RTCConfiguration;

    /**
     * Inject a factory function to create own transport interface implementation
     * based on initial transport object create by ITrackerClient.
     *
     * Default: just returns the initial transport.
     */
    mediaPeerTransportFilterFactory: PeerTransportFilterFactory
};

export type BKOptAccessProxySettings = Partial<BKAccessProxySettings>;

export const defaultSettings: BKAccessProxySettings = {

    webRtcMaxMessageSize: 64 * 1024 - 1, // 64Kbytes (why the -1 ?)

    p2pSegmentDownloadTimeout: 60000,

    trackerAnnounce: trackerDefaultAnounce,

    rtcConfig: rtcDefaultConfig,

    //mediaPeerTransportFilterFactory: (transport) => transport
    mediaPeerTransportFilterFactory: (transport) => new DefaultPeerTransportFilter(transport)
};

export enum BKAccessProxyEvents {
    ResourceRequested = 'resource:requested',

    ResourceEnqueuedHttp = 'resource:enqueued:http',

    ResourceEnqueuedP2p = 'resource:enqueued:p2p',

    /**
     * Emitted when segment has been downloaded.
     * Args: segment
     */
    ResourceFetched = 'resource:fetched',

    /**
     * Emitted when an error occurred while loading the segment.
     * Args: segment, error
     */
    ResourceError = 'resource:error',

    /**
     * Emitted for each segment that does not hit into a new segments queue when the load() method is called.
     * Args: segment
     */
    ResourceAbort = 'resource:abort',

    /**
     * Emitted when a peer is connected.
     * Args: peer
     */
    PeerConnect = 'peer:connect',

    /**
     * Emitted when a peer is disconnected.
     * Args: peerId
     */
    PeerClose = 'peer:close',

    PeerRequestReceived = 'peer:request',

    PeerResponseSent = 'peer:response-sent',
}

export interface BK_IProxy {
    on(event: string | symbol, listener: (...args: any[]) => void): BK_IProxy;
    once(event: string | symbol, listener: (...args: any[]) => void): BK_IProxy;
    off(event: string | symbol, listener: (...args: any[]) => void): BK_IProxy;
    enqueue(resource: BKResource): void;
    abort(resource: BKResource): void;
    terminate(): void;
    getSwarmId();
    setSwarmId(swarmId: string);
    getPeerId(): string;
    getPeerConnections(): BKPeer[];
    getWRTCConfig(): RTCConfiguration;
    readonly settings: BKAccessProxySettings;
}

export class BKAccessProxy extends EventEmitter implements BK_IProxy {

    public static isSupported(): boolean {
        const browserRtc = getBrowserRtc();
        return (browserRtc && (browserRtc.RTCPeerConnection.prototype.createDataChannel !== undefined));
    }

    readonly debug = Debug('bk:core:access-proxy');
    readonly settings: BKAccessProxySettings;

    private _httpDownloader: HttpDownloadQueue;
    private _peerAgent: BKPeerAgent;
    private _storedSegments: Map<string, BKResource> = new Map();
    private _bandwidthEstimator = new BandwidthEstimator();

    public constructor(settings: Partial<BKAccessProxySettings> = {}) {
        super();

        this.settings = Object.assign(defaultSettings, settings);
        this.debug('loader settings', this.settings);

        this._httpDownloader = new HttpDownloadQueue(
            this.onResourceLoaded.bind(this),
            this.onResourceError.bind(this)
        );

        //this._httpDownloader.on('bytes-downloaded', (bytes: number) => this.onChunkBytesDownloaded('http', bytes));

        this._peerAgent = new BKPeerAgent(this._storedSegments, this.settings);

        this._peerAgent.on('resource-fetched', this.onResourceLoaded.bind(this));
        this._peerAgent.on('resource-error', this.onResourceError.bind(this));
        this._peerAgent.on('bytes-downloaded', (bytes: number) => this.onChunkBytesDownloaded('p2p', bytes));
        this._peerAgent.on('bytes-uploaded', (bytes: number) => this.onChunkBytesUploaded('p2p', bytes));

        this._peerAgent.on('peer-connected', this.onPeerConnect.bind(this));
        this._peerAgent.on('peer-closed', this.onPeerClose.bind(this));
        this._peerAgent.on('peer-data-updated', this.onPeerDataUpdated.bind(this));
        this._peerAgent.on('peer-request-received', this.onPeerRequestReceived.bind(this));
        this._peerAgent.on('peer-response-sent', this.onPeerResponseSent.bind(this));
    }

    public enqueue(resource: BKResource): void {
        this.debug('enqueueing:', resource.getUrl());

        this.emit(BKAccessProxyEvents.ResourceRequested, resource);

        // update Swarm ID
        this._peerAgent.setSwarmId(resource.swarmId);

        if (this._peerAgent.enqueue(resource)) {
            this.debug('enqueued to p2p downloader');

            //resource.status = BKResourceStatus.LoadingViaP2p;
            resource.transportMode = BKResourceTransportMode.P2P;
            this.emit(BKAccessProxyEvents.ResourceEnqueuedP2p, resource);

        } else {
            this.debug('falling back to http downloader');

            this._httpDownloader.enqueue(resource);

            resource.transportMode = BKResourceTransportMode.HTTP;
            //resource.status = BKResourceStatus.LoadingViaHttp;
            this.emit(BKAccessProxyEvents.ResourceEnqueuedHttp, resource);
        }
    }

    public abort(resource: BKResource) {
        this._httpDownloader.abort(resource);
    }

    public setSwarmId(swarmId: string) {
        this._peerAgent.setSwarmId(swarmId);
    }

    public getSwarmId(): string {
        return this._peerAgent.getSwarmId();
    }

    public getPeerId(): string {
        return this._peerAgent.getPeerId();
    }

    public getWRTCConfig(): RTCConfiguration {
        return this.settings.rtcConfig;
    }

    public getPeerConnections(): BKPeer[] {
        return this._peerAgent.getPeerConnections();
    }

    public terminate(): void {
        this._httpDownloader.destroy();
        this._peerAgent.destroy();
        this._storedSegments.clear();
    }

    private _createSegmentsMap(): BKResourceMapData {
        const segmentsMap: BKResourceMapData = [];
        this._storedSegments.forEach((res) => segmentsMap.push([res.id, BKResourceStatus.Loaded]));
        this._httpDownloader.getQueuedList().forEach((res: BKResource) => segmentsMap.push([res.id, BKResourceStatus.LoadingViaHttp]));
        return segmentsMap;
    }

    // Event handlers

    private onChunkBytesDownloaded (method: "http" | "p2p", bytes: number) {
        this._bandwidthEstimator.addBytes(bytes, getPerfNow());
    }

    private onChunkBytesUploaded (method: "p2p", bytes: number) {
        this._bandwidthEstimator.addBytes(bytes, getPerfNow());
    }

    private onResourceLoaded (segment: BKResource) {
        this.debug('resource loaded', segment.id, segment.data);

        if (!segment.data || segment.data.byteLength === 0) {
            throw new Error('No data in resource loaded')
        }

        this._storedSegments.set(segment.id, segment);

        segment.lastAccessedAt = getPerfNow();

        this.emit(BKAccessProxyEvents.ResourceFetched, segment);

        this._peerAgent.sendSegmentsMapToAll(this._createSegmentsMap());
    }

    private onResourceError (segment: BKResource, errorData: any) {
        this.emit(BKAccessProxyEvents.ResourceError, segment, errorData);
    }

    private onPeerConnect (peer: {id: string}) {
        this._peerAgent.sendSegmentsMap(peer.id, this._createSegmentsMap());
        this.emit(BKAccessProxyEvents.PeerConnect, peer);
    }

    private onPeerClose (peerId: string) {
        this.emit(BKAccessProxyEvents.PeerClose, peerId);
    }

    private onPeerDataUpdated () {
        this.debug('peer data updated');
    }

    private onPeerRequestReceived(resource: BKResource, peer: BKPeer) {
        if (resource) {
            this.debug('peer request received resource', resource.id);
        } else {
            this.debug('peer request received for absent resource');
        }
        this.emit(BKAccessProxyEvents.PeerRequestReceived, resource, peer);
    }

    private onPeerResponseSent(resource: BKResource, peer: BKPeer) {
        if (resource) {
            this.debug('peer response sent for resource id:', resource.id);
        } else {
            this.debug('peer response sent with absent resource');
        }
        this.emit(BKAccessProxyEvents.PeerResponseSent, resource, peer);
    }
}
