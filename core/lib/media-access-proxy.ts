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
import {MediaDownloaderHttp} from "./media-downloader-http";
import {MediaDownloaderP2p} from "./media-downloader-p2p";
import {InternalSegmentData} from "./internal-segment";
import {SpeedApproximator} from "./speed-approximator";
import { MediaPeerTransportFilterFactory, DefaultMediaPeerTransportFilter } from "./media-peer-transport";
import { MediaSegment, MediaSegmentsMapData, MediaSegmentStatus } from "./media-segment";

const getBrowserRtc = require("get-browser-rtc");

export type MediaAccessProxySettings = {
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
     * The maximum priority of the segments to be downloaded (if not available) as quickly as possible (i.e. via HTTP method).
     */
    requiredSegmentsPriority: number;

    /**
     * Max number of simultaneous downloads from peers.
     */
    simultaneousP2PDownloads: number;

    /**
     * Probability of downloading remaining not downloaded segment in the segments queue via HTTP.
     */
    httpDownloadProbability: number;

    /**
     * Interval of the httpDownloadProbability check (in milliseconds).
     */
    httpDownloadProbabilityInterval: number;

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
    mediaPeerTransportFilterFactory: MediaPeerTransportFilterFactory
}

export const defaultSettings: MediaAccessProxySettings = {
    cachedSegmentExpiration: 5 * 60 * 1000,
    cachedSegmentsCount: 30,

    useP2P: true,
    requiredSegmentsPriority: 1,
    simultaneousP2PDownloads: 3,
    httpDownloadProbability: 0.06,
    httpDownloadProbabilityInterval: 500,
    bufferedSegmentsCount: 20,

    webRtcMaxMessageSize: 64 * 1024 - 1,
    p2pSegmentDownloadTimeout: 60000,
    trackerAnnounce: ["wss://tracker.btorrent.xyz/", "wss://tracker.openwebtorrent.com/"],
    rtcConfig: require("simple-peer").config,
    //mediaPeerTransportFilterFactory: (transport) => transport
    mediaPeerTransportFilterFactory: (transport) => new DefaultMediaPeerTransportFilter(transport)
};

export enum MediaAccessProxyEvents {
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

export interface IMediaDownloader {
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    load(segments: MediaSegment[], swarmId: string): void;
    getSegment(id: string): MediaSegment | undefined;
    getSettings(): any;
    destroy(): void;
}

export class MediaAccessProxy extends EventEmitter implements IMediaDownloader {

    private readonly debug = Debug("p2pml:media-access-proxy");
    private readonly httpManager: MediaDownloaderHttp;
    private readonly p2pManager: MediaDownloaderP2p;
    private readonly segments: Map<string, InternalSegmentData> = new Map();
    private segmentsQueue: MediaSegment[] = [];
    private httpDownloadProbabilityTimestamp = -999999;
    private readonly speedApproximator = new SpeedApproximator();
    private readonly settings: MediaAccessProxySettings;

    public static isSupported(): boolean {
        const browserRtc = getBrowserRtc();
        return (browserRtc && (browserRtc.RTCPeerConnection.prototype.createDataChannel !== undefined));
    }

    public constructor(settings: Partial<MediaAccessProxySettings> = {}) {
        super();

        this.settings = Object.assign(defaultSettings, settings);
        this.debug("loader settings", this.settings);

        this.httpManager = this.createHttpDownloader();
        this.httpManager.on("segment-loaded", this.onSegmentLoaded);
        this.httpManager.on("segment-error", this.onSegmentError);
        this.httpManager.on("bytes-downloaded", (bytes: number) => this.onPieceBytesDownloaded("http", bytes));

        this.p2pManager = this.createP2PDownloader();
        this.p2pManager.on("segment-loaded", this.onSegmentLoaded);
        this.p2pManager.on("segment-error", this.onSegmentError);
        this.p2pManager.on("peer-data-updated", () => this.processSegmentsQueue());
        this.p2pManager.on("bytes-downloaded", (bytes: number) => this.onPieceBytesDownloaded("p2p", bytes));
        this.p2pManager.on("bytes-uploaded", (bytes: number) => this.onPieceBytesUploaded("p2p", bytes));
        this.p2pManager.on("peer-connected", this.onPeerConnect);
        this.p2pManager.on("peer-closed", this.onPeerClose);
    }

    private createHttpDownloader() {
        return new MediaDownloaderHttp();
    }

    private createP2PDownloader() {
        return new MediaDownloaderP2p(this.segments, this.settings);
    }

    public load(segments: MediaSegment[], swarmId: string): void {
        this.p2pManager.setSwarmId(swarmId);
        this.debug("load segments", segments, this.segmentsQueue);

        let updateSegmentsMap = false;

        // stop all http requests and p2p downloads for segments that are not in the new load
        for (const segment of this.segmentsQueue) {
            if (!segments.find(f => f.url == segment.url)) {
                this.debug("remove segment", segment.url);
                if (this.httpManager.isDownloading(segment)) {
                    updateSegmentsMap = true;
                    this.httpManager.abort(segment);
                } else {
                    this.p2pManager.abort(segment);
                }
                this.emit(MediaAccessProxyEvents.SegmentAbort, segment);
            }
        }

        for (const segment of segments) {
            if (!this.segmentsQueue.find(f => f.url == segment.url)) {
                this.debug("add segment", segment.url);
            }
        }

        // renew segment queue
        this.segmentsQueue = segments;

        // run main processing algorithm
        updateSegmentsMap = this.processSegmentsQueue() || updateSegmentsMap;

        // collect garbage
        updateSegmentsMap = this.collectGarbage() || updateSegmentsMap;

        if (updateSegmentsMap) {
            this.p2pManager.sendSegmentsMapToAll(this.createSegmentsMap());
        }
    }

    public getSegment(id: string): MediaSegment | undefined {
        const segment = this.segments.get(id);
        return segment
            ? segment.data
                ? new MediaSegment(segment.id, segment.url, segment.range, segment.priority, segment.data, segment.downloadSpeed)
                : undefined
            : undefined;
    }

    public getSettings() {
        return this.settings;
    }

    public destroy(): void {
        this.segmentsQueue = [];
        this.httpManager.destroy();
        this.p2pManager.destroy();
        this.segments.clear();
    }

    private processSegmentsQueue(): boolean {
        const startingPriority = this.segmentsQueue.length > 0 ? this.segmentsQueue[0].priority : 0;
        this.debug("processSegmentsQueue - starting priority: " + startingPriority);

        let pendingCount = 0;
        for (const segment of this.segmentsQueue) {
            if (!this.segments.has(segment.id) && !this.httpManager.isDownloading(segment) && !this.p2pManager.isDownloading(segment)) {
                pendingCount++;
            }
        }

        if (pendingCount == 0) {
            return false;
        }

        let downloadedSegmentsCount = this.segmentsQueue.length - pendingCount;
        let updateSegmentsMap = false;

        for (let index = 0; index < this.segmentsQueue.length; index++) {
            const segment = this.segmentsQueue[index];
            const segmentPriority = index + startingPriority;

            if (!this.segments.has(segment.id)) {
                if (segmentPriority <= this.settings.requiredSegmentsPriority) {
                    if (segmentPriority == 0 && !this.httpManager.isDownloading(segment) && this.httpManager.getActiveDownloads().size > 0) {
                        for (const s of this.segmentsQueue) {
                            this.httpManager.abort(s);
                            updateSegmentsMap = true;
                        }
                    }

                    if (this.httpManager.getActiveDownloads().size == 0) {
                        this.p2pManager.abort(segment);
                        this.httpManager.download(segment);
                        this.debug("HTTP download (priority)", segment.priority, segment.url);
                        updateSegmentsMap = true;
                    }
                } else if (!this.httpManager.isDownloading(segment) && this.p2pManager.getActiveDownloadsCount() < this.settings.simultaneousP2PDownloads && downloadedSegmentsCount < this.settings.bufferedSegmentsCount) {
                    if (this.p2pManager.download(segment)) {
                        this.debug("P2P download", segment.priority, segment.url);
                    }
                }
            }

            if (this.httpManager.getActiveDownloads().size == 1 && this.p2pManager.getActiveDownloadsCount() == this.settings.simultaneousP2PDownloads) {
                return updateSegmentsMap;
            }
        }

        if (this.httpManager.getActiveDownloads().size > 0) {
            return updateSegmentsMap;
        }

        const now = this.now();
        if (now - this.httpDownloadProbabilityTimestamp < this.settings.httpDownloadProbabilityInterval) {
            return updateSegmentsMap;
        } else {
            this.httpDownloadProbabilityTimestamp = now;
        }

        let pendingQueue = this.segmentsQueue.filter(segment =>
            !this.segments.has(segment.id) &&
            !this.p2pManager.isDownloading(segment));
        downloadedSegmentsCount = this.segmentsQueue.length - pendingQueue.length;

        if (pendingQueue.length == 0 || downloadedSegmentsCount >= this.settings.bufferedSegmentsCount) {
            return updateSegmentsMap;
        }

        const segmentsMap = this.p2pManager.getOvrallSegmentsMap();
        pendingQueue = pendingQueue.filter(segment => !segmentsMap.get(segment.id));

        if (pendingQueue.length == 0) {
            return updateSegmentsMap;
        }

        for (const segment of pendingQueue) {
            if (Math.random() <= this.settings.httpDownloadProbability) {
                this.debug("HTTP download (random)", segment.priority, segment.url);
                this.httpManager.download(segment);
                updateSegmentsMap = true;
                break;
            }
        }

        return updateSegmentsMap;
    }

    private onPieceBytesDownloaded = (method: "http" | "p2p", bytes: number) => {
        this.speedApproximator.addBytes(bytes, this.now());
        this.emit(MediaAccessProxyEvents.PieceBytesDownloaded, method, bytes);
    }

    private onPieceBytesUploaded = (method: "p2p", bytes: number) => {
        this.speedApproximator.addBytes(bytes, this.now());
        this.emit(MediaAccessProxyEvents.PieceBytesUploaded, method, bytes);
    }

    private onSegmentLoaded = (segment: MediaSegment, data: ArrayBuffer) => {
        this.debug("segment loaded", segment.id, segment.url);

        const segmentInternal = new InternalSegmentData(
            segment.id,
            segment.url,
            segment.range,
            segment.priority,
            data,
            this.speedApproximator.getSpeed(this.now())
        );

        this.segments.set(segment.id, segmentInternal);
        this.emitSegmentLoaded(segmentInternal);
        this.processSegmentsQueue();
        this.p2pManager.sendSegmentsMapToAll(this.createSegmentsMap());
    }

    private onSegmentError = (segment: MediaSegment, event: any) => {
        this.emit(MediaAccessProxyEvents.SegmentError, segment, event);
        this.processSegmentsQueue();
    }

    private emitSegmentLoaded(segmentInternal: InternalSegmentData): void {
        segmentInternal.lastAccessed = this.now();

        const segment = new MediaSegment(
            segmentInternal.id,
            segmentInternal.url,
            segmentInternal.range,
            segmentInternal.priority,
            segmentInternal.data,
            segmentInternal.downloadSpeed
        );

        this.emit(MediaAccessProxyEvents.SegmentLoaded, segment);
    }

    private createSegmentsMap(): MediaSegmentsMapData {
        const segmentsMap: MediaSegmentsMapData = [];
        this.segments.forEach((value, key) => segmentsMap.push([key, MediaSegmentStatus.Loaded]));
        this.httpManager.getActiveDownloads().forEach((value, key) => segmentsMap.push([key, MediaSegmentStatus.LoadingByHttp]));
        return segmentsMap;
    }

    private onPeerConnect = (peer: {id: string}) => {
        this.p2pManager.sendSegmentsMap(peer.id, this.createSegmentsMap());
        this.emit(MediaAccessProxyEvents.PeerConnect, peer);
    }

    private onPeerClose = (peerId: string) => {
        this.emit(MediaAccessProxyEvents.PeerClose, peerId);
    }

    private collectGarbage(): boolean {
        const segmentsToDelete: string[] = [];
        const remainingSegments: InternalSegmentData[] = [];

        // Delete old segments
        const now = this.now();
        this.segments.forEach(segment => {
            if (now - segment.lastAccessed > this.settings.cachedSegmentExpiration) {
                segmentsToDelete.push(segment.id);
            } else {
                remainingSegments.push(segment);
            }
        });

        // Delete segments over cached count
        let countOverhead = remainingSegments.length - this.settings.cachedSegmentsCount;
        if (countOverhead > 0) {
            remainingSegments.sort((a, b) => a.lastAccessed - b.lastAccessed);

            for (const segment of remainingSegments) {
                if (!this.segmentsQueue.find(queueSegment => queueSegment.id == segment.id)) {
                    segmentsToDelete.push(segment.id);
                    countOverhead--;
                    if (countOverhead == 0) {
                        break;
                    }
                }
            }
        }

        segmentsToDelete.forEach(id => this.segments.delete(id));
        return segmentsToDelete.length > 0;
    }

    private now() {
        return performance.now();
    }

} // end of HybridLoader

