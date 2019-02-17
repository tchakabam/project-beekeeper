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

import { BKResource, BKResourceTransportMode } from './bk-resource';

import { getPerfNow } from './perf-now';
import { BKPeer } from './peer';
import { BKResourceMapData, createBKResourceState } from './bk-resource-map';
import { BKAccessProxySettings, defaultSettings } from './bk-access-proxy-settings';
import { BKAccessProxyEvents } from './bk-access-proxy-events';

const getBrowserRtc = require('get-browser-rtc');

/**
 * @interface
 * Defines external interface of access-proxy
 */
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

export type BKResourceCacheMap = Map<string, BKResource>;

/**
 * @class
 */
export class BKAccessProxy extends EventEmitter implements BK_IProxy {

    public static isSupported(): boolean {
        const browserRtc = getBrowserRtc();
        return (browserRtc && (browserRtc.RTCPeerConnection.prototype.createDataChannel !== undefined));
    }

    readonly settings: BKAccessProxySettings;

    private debug = Debug('bk:core:access-proxy');

    private _httpDownloader: HttpDownloadQueue;

    private _peerAgent: BKPeerAgent;

    private _cachedResources: BKResourceCacheMap = new Map();

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

        this._peerAgent = new BKPeerAgent(this._cachedResources, this.settings);

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

    public getCachedResources(): BKResourceCacheMap {
        return this._cachedResources;
    }

    public getOwnCurrentResourcesMapData(): BKResourceMapData {
        return this._createResourcesMap();
    }

    public terminate(): void {
        this._httpDownloader.destroy();
        this._peerAgent.destroy();
        this._cachedResources.clear();
    }

    private _createResourcesMap(): BKResourceMapData {
        const resourcesMap: BKResourceMapData = [];

        this._cachedResources.forEach((res: BKResource) => {
            resourcesMap.push(
                [res.id, createBKResourceState(res.requestedBytesLoaded, res.requestedBytesTotal)]
            );
        });

        this._httpDownloader.getQueuedList().forEach((res: BKResource) => {
            resourcesMap.push(
                [res.id, createBKResourceState(res.requestedBytesLoaded, res.requestedBytesTotal)]
            );
        });

        return resourcesMap;
    }

    // Event handlers

    private onChunkBytesDownloaded (method: "http" | "p2p", bytes: number) {
        this._bandwidthEstimator.addBytes(bytes, getPerfNow());
    }

    private onChunkBytesUploaded (method: "p2p", bytes: number) {
        this._bandwidthEstimator.addBytes(bytes, getPerfNow());
    }

    private onResourceLoaded (resource: BKResource) {
        this.debug('resource loaded', resource.id, resource.data);

        if (!resource.data || resource.data.byteLength === 0) {
            throw new Error('No data in resource loaded')
        }

        this._cachedResources.set(resource.id, resource);

        resource.lastAccessedAt = getPerfNow();

        this.emit(BKAccessProxyEvents.ResourceFetched, resource);

        this._peerAgent.sendResourcesMapToAll(this._createResourcesMap());
    }

    private onResourceError (resource: BKResource, errorData: any) {
        this.emit(BKAccessProxyEvents.ResourceError, resource, errorData);
    }

    private onPeerConnect (peer: {id: string}) {
        this._peerAgent.sendResourcesMap(peer.id, this._createResourcesMap());
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
