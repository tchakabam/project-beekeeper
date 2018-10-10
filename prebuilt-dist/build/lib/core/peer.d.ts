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
import { StringlyTypedEventEmitter } from './stringly-typed-event-emitter';
import { IPeerTransport } from './peer-transport';
import { BKResourceStatus, BKResourceMapData } from './bk-resource';
export declare type PeerInfo = {
    id: string;
    remoteAddress: string;
};
export declare class Peer extends StringlyTypedEventEmitter<"connect" | "close" | "data-updated" | "resource-request" | "resource-absent" | "resource-fetched" | "resource-error" | "resource-timeout" | "bytes-downloaded" | "bytes-uploaded"> {
    private readonly _peerTransport;
    readonly settings: {
        p2pSegmentDownloadTimeout: number;
        webRtcMaxMessageSize: number;
    };
    private _id;
    private _remoteAddress;
    private debug;
    private _downloadingSegmentId;
    private _downloadingSegment;
    private _segmentsMap;
    private _timer;
    private _isSafari11_0;
    constructor(_peerTransport: IPeerTransport, settings: {
        p2pSegmentDownloadTimeout: number;
        webRtcMaxMessageSize: number;
    });
    readonly id: string;
    readonly remoteAddress: string;
    getInfo(): PeerInfo;
    destroy(): void;
    getDownloadingSegmentId(): string | null;
    getSegmentsMap(): Map<string, BKResourceStatus>;
    sendSegmentsMap(segments: BKResourceMapData): void;
    sendSegmentData(segmentId: string, data: ArrayBuffer): void;
    sendSegmentAbsent(segmentId: string): void;
    sendSegmentRequest(segmentId: string): void;
    sendCancelSegmentRequest(): void;
    getTransportInterface(): IPeerTransport;
    private _sendCommand;
    private _scheduleResponseTimeout;
    private _cancelResponseTimeout;
    private _terminateSegmentRequest;
    private _handleSegmentChunk;
    private _onPeerData;
    private _onPeerConnect;
    private _onPeerClose;
}
