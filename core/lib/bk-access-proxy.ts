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
import { ByteRange } from "../../ext-mod/emliri-es-libs/rialto/lib/byte-range";

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
     * Emitted when a segment piece has been downloaded.
     * Args: method (can be "http" or "p2p" only), bytes
     */
    PieceBytesDownloaded = "piece_bytes_downloaded",

    /**
     * Emitted when a segment piece has been uploaded.
     * Args: method (can be "p2p" only), bytes
     */
    PieceBytesUploaded = "piece_bytes_uploaded"
}

export interface BK_IProxy {
    on(event: string | symbol, listener: (...args: any[]) => void): BK_IProxy;
    load(segments: BKResource[], swarmId: string): void;
    destroy(): void;
}

export class BKAccessProxy extends EventEmitter implements BK_IProxy {

    private readonly debug = Debug("p2pml:media-access-proxy");

    private readonly _httpDownloader: DownloaderHttp;
    private readonly _p2pDownloader: DownloaderP2p;
    private readonly _storedSegments: Map<string, BKResource> = new Map();
    private _loadingSegmentsQueue: BKResource[] = [];

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
        this._httpDownloader.on("bytes-downloaded", (bytes: number) => this.onPieceBytesDownloaded("http", bytes));

        this._p2pDownloader = new DownloaderP2p(this._storedSegments, this.settings);
        this._p2pDownloader.on("segment-loaded", this.onSegmentLoaded);
        this._p2pDownloader.on("segment-error", this.onSegmentError);
        this._p2pDownloader.on("peer-data-updated", () => this._processSegmentsQueue());
        this._p2pDownloader.on("bytes-downloaded", (bytes: number) => this.onPieceBytesDownloaded("p2p", bytes));
        this._p2pDownloader.on("bytes-uploaded", (bytes: number) => this.onPieceBytesUploaded("p2p", bytes));
        this._p2pDownloader.on("peer-connected", this.onPeerConnect);
        this._p2pDownloader.on("peer-closed", this.onPeerClose);
    }

    public load(segments: BKResource[], swarmId: string): void {

        // update Swarm ID
        this._p2pDownloader.setSwarmId(swarmId);

        this.debug("load segments", segments, this._loadingSegmentsQueue);

        let updateSegmentsMap = false;

        // stop all http requests and p2p downloads for segments that are not in the new load

        /*

        for (const segment of this._loadingSegmentsQueue) {
            if (!segments.find(f => f.uri == segment.uri)) {
                this.debug("remove segment", segment.uri);
                if (this._httpDownloader.isDownloading(segment)) {
                    updateSegmentsMap = true;
                    this._httpDownloader.abort(segment);
                } else {
                    this._p2pDownloader.abort(segment);
                }
                this.emit(MediaAccessProxyEvents.SegmentAbort, segment);
            }
        }

        // log if segment was added
        for (const segment of segments) {
            if (!this._loadingSegmentsQueue.find(f => f.uri == segment.uri)) {
                this.debug("add segment", segment.uri);
            }
        }
        */

        // update segment queue
        this._loadingSegmentsQueue = segments;

        // run main processing algorithm
        updateSegmentsMap = this._processSegmentsQueue() || updateSegmentsMap;

        // collect garbage
        updateSegmentsMap = this._collectGarbage() || updateSegmentsMap;

        if (updateSegmentsMap) {
            this.debug("sending segments map to all")
            this._p2pDownloader.sendSegmentsMapToAll(this._createSegmentsMap());
        }
    }

    public destroy(): void {
        this._loadingSegmentsQueue = [];
        this._httpDownloader.destroy();
        this._p2pDownloader.destroy();
        this._storedSegments.clear();
    }

    private _processSegmentsQueue(): boolean {

        this._loadingSegmentsQueue.forEach((resource: BKResource) => {

            /*
            let isHttpDownloading = this._httpDownloader.isDownloading(resource);
            let isP2PDownloading = this._p2pDownloader.isDownloading(resource);

            if (!isHttpDownloading && !isP2PDownloading) {
                this._httpDownloader.download(resource);
            }
            */
        })

        return true;
    }

    private _collectGarbage(): boolean {
        return true;
    }

    private _createSegmentsMap(): BKResourceMapData {
        /*
        const segmentsMap: BKResourceMapData = [];
        this._storedSegments.forEach((value, key) => segmentsMap.push([key, BKResourceStatus.Loaded]));
        this._httpDownloader.getActiveDownloads().forEach((value, key) => segmentsMap.push([key, BKResourceStatus.LoadingViaHttp]));
        return segmentsMap;
        */
       return [];
    }

    // Event handlers

    private onPieceBytesDownloaded = (method: "http" | "p2p", bytes: number) => {
        this.speedApproximator.addBytes(bytes, getPerfNow());
        this.emit(BKAccessProxyEvents.PieceBytesDownloaded, method, bytes);
    }

    private onPieceBytesUploaded = (method: "p2p", bytes: number) => {
        this.speedApproximator.addBytes(bytes, getPerfNow());
        this.emit(BKAccessProxyEvents.PieceBytesUploaded, method, bytes);
    }

    private onSegmentLoaded = (segment: BKResource, data: ArrayBuffer) => {
        this.debug("segment loaded", segment.id, segment.uri);

        this._storedSegments.set(segment.id, segment);

        segment.lastAccessedAt = getPerfNow();

        this.emit(BKAccessProxyEvents.SegmentLoaded, segment);

        this._processSegmentsQueue();

        this._p2pDownloader.sendSegmentsMapToAll(this._createSegmentsMap());
    }

    private onSegmentError = (segment: BKResource, event: any) => {
        this.emit(BKAccessProxyEvents.SegmentError, segment, event);
        this._processSegmentsQueue();
    }

    private onPeerConnect = (peer: {id: string}) => {
        this._p2pDownloader.sendSegmentsMap(peer.id, this._createSegmentsMap());
        this.emit(BKAccessProxyEvents.PeerConnect, peer);
    }

    private onPeerClose = (peerId: string) => {
        this.emit(BKAccessProxyEvents.PeerClose, peerId);
    }
}
