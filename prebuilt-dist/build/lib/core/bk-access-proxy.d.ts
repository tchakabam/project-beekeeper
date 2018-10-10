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
import { EventEmitter } from 'eventemitter3';
import { PeerTransportFilterFactory } from './peer-transport';
import { BKResource } from './bk-resource';
import { Peer } from './peer';
export declare type BKAccessProxySettings = {
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
    mediaPeerTransportFilterFactory: PeerTransportFilterFactory;
};
export declare type BKOptAccessProxySettings = Partial<BKAccessProxySettings>;
export declare const defaultSettings: BKAccessProxySettings;
export declare enum BKAccessProxyEvents {
    ResourceRequested = "resource:requested",
    ResourceEnqueuedHttp = "resource:enqueued:http",
    ResourceEnqueuedP2p = "resource:enqueued:p2p",
    /**
     * Emitted when segment has been downloaded.
     * Args: segment
     */
    ResourceFetched = "resource:fetched",
    /**
     * Emitted when an error occurred while loading the segment.
     * Args: segment, error
     */
    ResourceError = "resource:error",
    /**
     * Emitted for each segment that does not hit into a new segments queue when the load() method is called.
     * Args: segment
     */
    ResourceAbort = "resource:abort",
    /**
     * Emitted when a peer is connected.
     * Args: peer
     */
    PeerConnect = "peer:connect",
    /**
     * Emitted when a peer is disconnected.
     * Args: peerId
     */
    PeerClose = "peer:close",
    PeerRequestReceived = "peer:request",
    PeerResponseSent = "peer:response-sent"
}
export interface BK_IProxy {
    on(event: string | symbol, listener: (...args: any[]) => void): BK_IProxy;
    once(event: string | symbol, listener: (...args: any[]) => void): BK_IProxy;
    off(event: string | symbol, listener: (...args: any[]) => void): BK_IProxy;
    enqueue(resource: BKResource): void;
    abort(resource: BKResource): void;
    terminate(): void;
    getSwarmId(): any;
    setSwarmId(swarmId: string): any;
    getPeerId(): string;
    getPeerConnections(): Peer[];
    getWRTCConfig(): RTCConfiguration;
    readonly settings: BKAccessProxySettings;
}
export declare class BKAccessProxy extends EventEmitter implements BK_IProxy {
    static isSupported(): boolean;
    readonly debug: Debug.IDebugger;
    readonly settings: BKAccessProxySettings;
    private _httpDownloader;
    private _peerAgent;
    private _storedSegments;
    private _bandwidthEstimator;
    constructor(settings?: Partial<BKAccessProxySettings>);
    enqueue(resource: BKResource): void;
    abort(resource: BKResource): void;
    setSwarmId(swarmId: string): void;
    getSwarmId(): string;
    getPeerId(): string;
    getWRTCConfig(): RTCConfiguration;
    getPeerConnections(): Peer[];
    terminate(): void;
    private _createSegmentsMap;
    private onChunkBytesDownloaded;
    private onChunkBytesUploaded;
    private onResourceLoaded;
    private onResourceError;
    private onPeerConnect;
    private onPeerClose;
    private onPeerDataUpdated;
    private onPeerRequestReceived;
    private onPeerResponseSent;
}
