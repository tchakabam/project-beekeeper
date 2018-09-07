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

import * as Debug from "debug";

import {EventEmitter} from "eventemitter3"
import {DownloaderHttp} from "./downloader-http";
import {DownloaderP2p} from "./downloader-p2p";
import {SpeedApproximator} from "./speed-approximator";
import { PeerTransportFilterFactory, DefaultPeerTransportFilter } from "./peer-transport";

import { BKResource, BKResourceMapData, BKResourceStatus } from "./bk-resource";

import { getPerfNow } from "./perf-now";

const getBrowserRtc = require("get-browser-rtc");

const rtcDefaultConfig: RTCConfiguration = require("simple-peer").config;

const trackerDefaultAnounce = ["wss://tracker.btorrent.xyz/", "wss://tracker.openwebtorrent.com/"];

export type BKAccessProxySettings = {
    /**
     * Segment lifetime in cache. The segment is deleted from the cache if the last access time is greater than this value (in milliseconds).
     */
    cachedSegmentExpiration: number;

    /**
     * Max number of segments that can be stored in the cache.
     */
    cachedSegmentsCount: number;

    /**
     * Enable/Disable peers interaction.
     */
    useP2P: boolean;

    /**
     * Max number of simultaneous downloads from peers.
     */
    simultaneousP2PDownloads: number;

    /**
     * Max number of the segments to be downloaded via HTTP or P2P methods.
     */
    bufferedSegmentsCount: number;

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
}

export type BKOptAccessProxySettings = Partial<BKAccessProxySettings>;

export const defaultSettings: BKAccessProxySettings = {
    cachedSegmentExpiration: 5 * 60 * 1000,

    cachedSegmentsCount: 30,

    useP2P: true,

    simultaneousP2PDownloads: 3,

    bufferedSegmentsCount: 20,

    webRtcMaxMessageSize: 64 * 1024 - 1,

    p2pSegmentDownloadTimeout: 60000,

    trackerAnnounce: trackerDefaultAnounce,

    rtcConfig: rtcDefaultConfig,

    //mediaPeerTransportFilterFactory: (transport) => transport
    mediaPeerTransportFilterFactory: (transport) => new DefaultPeerTransportFilter(transport)
};

export enum BKAccessProxyEvents {
    /**
     * Emitted when segment has been downloaded.
     * Args: segment
     */
    SegmentLoaded = "segment_loaded",

    /**
     * Emitted when an error occurred while loading the segment.
     * Args: segment, error
     */
    SegmentError = "segment_error",

    /**
     * Emitted for each segment that does not hit into a new segments queue when the load() method is called.
     * Args: segment
     */
    SegmentAbort = "segment_abort",

    /**
     * Emitted when a peer is connected.
     * Args: peer
     */
    PeerConnect = "peer_connect",

    /**
     * Emitted when a peer is disconnected.
     * Args: peerId
     */
    PeerClose = "peer_close",

    /**
     * Emitted when a segment chunk has been downloaded.
     * Args: method (can be "http" or "p2p" only), bytes
     */
    ChunkBytesDownloaded = "chunk_bytes_downloaded",

    /**
     * Emitted when a segment chunk has been uploaded.
     * Args: method (can be "p2p" only), bytes
     */
    ChunkBytesUploaded = "chunk_bytes_uploaded"
}

export interface BK_IProxy {
    on(event: string | symbol, listener: (...args: any[]) => void): BK_IProxy;
    enqueue(resource: BKResource): void;
    abort(resource: BKResource): void;
    terminate(): void;
    setSwarmId(swarmId: string);
}

export class BKAccessProxy extends EventEmitter implements BK_IProxy {

    private readonly debug = Debug("p2pml:access-proxy");

    private readonly _httpDownloader: DownloaderHttp;
    private readonly _p2pDownloader: DownloaderP2p;
    private readonly _storedSegments: Map<string, BKResource> = new Map();

    private readonly speedApproximator = new SpeedApproximator();
    private readonly settings: BKAccessProxySettings;

    public static isSupported(): boolean {
        const browserRtc = getBrowserRtc();
        return (browserRtc && (browserRtc.RTCPeerConnection.prototype.createDataChannel !== undefined));
    }

    public constructor(settings: Partial<BKAccessProxySettings> = {}) {
        super();

        this.settings = Object.assign(defaultSettings, settings);
        this.debug("loader settings", this.settings);

        this._httpDownloader = new DownloaderHttp();
        this._httpDownloader.on("segment-loaded", this.onSegmentLoaded);
        this._httpDownloader.on("segment-error", this.onSegmentError);
        this._httpDownloader.on("bytes-downloaded", (bytes: number) => this.onChunkBytesDownloaded("http", bytes));

        this._p2pDownloader = new DownloaderP2p(this._storedSegments, this.settings);
        this._p2pDownloader.on("segment-loaded", this.onSegmentLoaded);
        this._p2pDownloader.on("segment-error", this.onSegmentError);

        this._p2pDownloader.on("bytes-downloaded", (bytes: number) => this.onChunkBytesDownloaded("p2p", bytes));
        this._p2pDownloader.on("bytes-uploaded", (bytes: number) => this.onChunkBytesUploaded("p2p", bytes));

        this._p2pDownloader.on("peer-connected", this.onPeerConnect);
        this._p2pDownloader.on("peer-closed", this.onPeerClose);
        this._p2pDownloader.on("peer-data-updated", this.onPeerDataUpdated);
    }

    public enqueue(resource: BKResource): void {
        this.debug("enqueueing:", resource);

        // update Swarm ID
        this._p2pDownloader.setSwarmId(resource.swarmId);

        if (this._p2pDownloader.enqueue(resource)) {
            this.debug("enqueud to p2p downloader")
        } else {
            this.debug("falling back to http downloader")
            this._httpDownloader.enqueue(resource);
        }
    }

    public abort(resource: BKResource) {
        this._httpDownloader.abort(resource);
    }

    public setSwarmId(swarmId: string) {
        this._p2pDownloader.setSwarmId(swarmId);
    }

    public terminate(): void {
        this._httpDownloader.destroy();
        this._p2pDownloader.destroy();
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
        this.speedApproximator.addBytes(bytes, getPerfNow());
        this.emit(BKAccessProxyEvents.ChunkBytesDownloaded, method, bytes);
    }

    private onChunkBytesUploaded = (method: "p2p", bytes: number) => {
        this.speedApproximator.addBytes(bytes, getPerfNow());
        this.emit(BKAccessProxyEvents.ChunkBytesUploaded, method, bytes);
    }

    private onSegmentLoaded = (segment: BKResource, data: ArrayBuffer) => {
        this.debug("segment loaded", segment.id, segment.uri);

        this._storedSegments.set(segment.id, segment);

        segment.lastAccessedAt = getPerfNow();

        this.emit(BKAccessProxyEvents.SegmentLoaded, segment);

        this._p2pDownloader.sendSegmentsMapToAll(this._createSegmentsMap());
    }

    private onSegmentError = (segment: BKResource, event: any) => {
        this.emit(BKAccessProxyEvents.SegmentError, segment, event);
    }

    private onPeerConnect = (peer: {id: string}) => {
        this._p2pDownloader.sendSegmentsMap(peer.id, this._createSegmentsMap());
        this.emit(BKAccessProxyEvents.PeerConnect, peer);
    }

    private onPeerClose = (peerId: string) => {
        this.emit(BKAccessProxyEvents.PeerClose, peerId);
    }

    private onPeerDataUpdated = () => {
        this.debug("peer data updated");
    }
}
