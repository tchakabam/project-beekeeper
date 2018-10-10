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
/// <reference path="../../decl/bittorrent.d.ts" />
import { StringlyTypedEventEmitter } from './stringly-typed-event-emitter';
import { Peer } from './peer';
import { BKResource, BKResourceStatus, BKResourceMapData } from './bk-resource';
import { PeerTransportFilterFactory } from './peer-transport';
export interface ITrackerClient {
    on(event: string, callback: (data: any) => void): void;
    start(): void;
    stop(): void;
    destroy(): void;
}
export declare class PeerAgent extends StringlyTypedEventEmitter<"peer-connected" | "peer-closed" | "peer-data-updated" | "peer-request-received" | "peer-response-sent" | "resource-fetched" | "resource-error" | "bytes-downloaded" | "bytes-uploaded"> {
    private readonly cachedSegments;
    readonly settings: {
        trackerAnnounce: string[];
        p2pSegmentDownloadTimeout: number;
        webRtcMaxMessageSize: number;
        mediaPeerTransportFilterFactory: PeerTransportFilterFactory;
        rtcConfig?: RTCConfiguration;
    };
    private _trackerClient;
    private _peers;
    private _peerCandidates;
    private _peerResourceTransfers;
    private _swarmId;
    private _peerId;
    private debug;
    constructor(cachedSegments: Map<string, BKResource>, settings: {
        trackerAnnounce: string[];
        p2pSegmentDownloadTimeout: number;
        webRtcMaxMessageSize: number;
        mediaPeerTransportFilterFactory: PeerTransportFilterFactory;
        rtcConfig?: RTCConfiguration;
    });
    destroy(): void;
    enqueue(resource: BKResource): boolean;
    abort(segment: BKResource): void;
    isDownloading(segment: BKResource): boolean;
    getActiveDownloadsCount(): number;
    sendSegmentsMapToAll(segmentsMap: BKResourceMapData): void;
    sendSegmentsMap(peerId: string, segmentsMap: BKResourceMapData): void;
    getOverallSegmentsMap(): Map<string, BKResourceStatus>;
    getPeerId(): string;
    getSwarmId(): string;
    setSwarmId(swarmId: string): void;
    getPeerConnections(): Peer[];
    private _createClient;
    private _onTrackerError;
    private _onTrackerWarning;
    private _onTrackerUpdate;
    private _onTrackerPeer;
    private _onBytesDownloaded;
    private _onBytesUploaded;
    private _onPeerConnect;
    private _onPeerClose;
    private _onPeerDataUpdated;
    private _onResourceRequest;
    private _onResourceFetched;
    private _onResourceAbsent;
    private _onResourceError;
    private _onResourceTimeout;
}
