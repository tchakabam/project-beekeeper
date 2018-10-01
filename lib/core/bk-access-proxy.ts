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
import {PeerAgent} from './peer-agent';
import {BandwidthEstimator} from './bandwidth-estimator';
import { PeerTransportFilterFactory, DefaultPeerTransportFilter } from './peer-transport';

import { BKResource, BKResourceMapData, BKResourceStatus } from './bk-resource';

import { getPerfNow } from './perf-now';
import { Peer } from './peer';

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

    webRtcMaxMessageSize: 64 * 1024 - 1,

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
    ResourceLoaded = 'segment_loaded',

    /**
     * Emitted when an error occurred while loading the segment.
     * Args: segment, error
     */
    ResourceError = 'segment_error',

    /**
     * Emitted for each segment that does not hit into a new segments queue when the load() method is called.
     * Args: segment
     */
    ResourceAbort = 'segment_abort',

    /**
     * Emitted when a peer is connected.
     * Args: peer
     */
    PeerConnect = 'peer_connect',

    /**
     * Emitted when a peer is disconnected.
     * Args: peerId
     */
    PeerClose = 'peer_close',

    /**
     * Emitted when a segment chunk has been downloaded.
     * Args: method (can be "http" or "p2p" only), bytes
     */
    ChunkBytesDownloaded = 'chunk_bytes_downloaded',

    /**
     * Emitted when a segment chunk has been uploaded.
     * Args: method (can be "p2p" only), bytes
     */
    ChunkBytesUploaded = 'chunk_bytes_uploaded'
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
    getPeerConnections(): Peer[];
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
    private _peerAgent: PeerAgent;
    private _storedSegments: Map<string, BKResource> = new Map();
    private _bandwidthEstimator = new BandwidthEstimator();

    public constructor(settings: Partial<BKAccessProxySettings> = {}) {
        super();

        this.settings = Object.assign(defaultSettings, settings);
        this.debug('loader settings', this.settings);

        this._httpDownloader = new HttpDownloadQueue(
            this.onResourceLoaded.bind(this),
            this.onResourceError
        );

        //this._httpDownloader.on('bytes-downloaded', (bytes: number) => this.onChunkBytesDownloaded('http', bytes));

        this._peerAgent = new PeerAgent(this._storedSegments, this.settings);
        this._peerAgent.on('segment-loaded', this.onResourceLoaded);
        this._peerAgent.on('segment-error', this.onResourceError);

        this._peerAgent.on('bytes-downloaded', (bytes: number) => this.onChunkBytesDownloaded('p2p', bytes));
        this._peerAgent.on('bytes-uploaded', (bytes: number) => this.onChunkBytesUploaded('p2p', bytes));

        this._peerAgent.on('peer-connected', this.onPeerConnect);
        this._peerAgent.on('peer-closed', this.onPeerClose);
        this._peerAgent.on('peer-data-updated', this.onPeerDataUpdated);
    }

    public enqueue(resource: BKResource): void {
        this.debug('enqueueing:', resource.getUrl());

        this.emit(BKAccessProxyEvents.ResourceRequested, resource);

        // update Swarm ID
        this._peerAgent.setSwarmId(resource.swarmId);

        if (this._peerAgent.enqueue(resource)) {
            this.debug('enqueued to p2p downloader');
            this.emit(BKAccessProxyEvents.ResourceEnqueuedP2p, resource);
        } else {
            this.debug('falling back to http downloader');
            this._httpDownloader.enqueue(resource);
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

    public getPeerConnections(): Peer[] {
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

    private onChunkBytesDownloaded = (method: "http" | "p2p", bytes: number) => {
        this._bandwidthEstimator.addBytes(bytes, getPerfNow());
        this.emit(BKAccessProxyEvents.ChunkBytesDownloaded, method, bytes);
    }

    private onChunkBytesUploaded = (method: "p2p", bytes: number) => {
        this._bandwidthEstimator.addBytes(bytes, getPerfNow());
        this.emit(BKAccessProxyEvents.ChunkBytesUploaded, method, bytes);
    }

    private onResourceLoaded = (segment: BKResource) => {
        this.debug('resource loaded', segment.id, segment.data);

        if (!segment.data || segment.data.byteLength === 0) {
            throw new Error('No data in resource loaded')
        }

        this._storedSegments.set(segment.id, segment);

        segment.lastAccessedAt = getPerfNow();

        this.emit(BKAccessProxyEvents.ResourceLoaded, segment);

        this._peerAgent.sendSegmentsMapToAll(this._createSegmentsMap());
    }

    private onResourceError = (segment: BKResource, event: any) => {
        this.emit(BKAccessProxyEvents.ResourceError, segment, event);
    }

    private onPeerConnect = (peer: {id: string}) => {
        this._peerAgent.sendSegmentsMap(peer.id, this._createSegmentsMap());
        this.emit(BKAccessProxyEvents.PeerConnect, peer);
    }

    private onPeerClose = (peerId: string) => {
        this.emit(BKAccessProxyEvents.PeerClose, peerId);
    }

    private onPeerDataUpdated = () => {
        this.debug('peer data updated');
    }
}
