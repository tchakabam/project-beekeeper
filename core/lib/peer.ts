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

import {StringlyTypedEventEmitter} from "./stringly-typed-event-emitter";
import { detectSafari11_0 } from "./detect-safari-11";

import { IPeerTransport, PeerCommandType, PeerTransportCommand, decodeMediaPeerTransportCommand } from "./peer-transport";

import { BKResourceMap, BKResourceStatus, BKResourceMapData } from "./bk-resource";

// TODO: Make this ResourceRequest
class PeerDataTransmission {
    public bytesDownloaded = 0;
    public chunks: ArrayBuffer[] = [];

    constructor(readonly id: string, readonly size: number) {}
}

export type PeerInfo = {
    id: string,
    remoteAddress: string
}

export class Peer extends StringlyTypedEventEmitter<
    // TODO: make proper enum for these events
    "connect" | "close" | "data-updated" |
    "segment-request" | "segment-absent" |
    "segment-loaded" | "segment-error" |
    "segment-timeout" |
    "bytes-downloaded" | "bytes-uploaded"
> {

    private _id: string;
    private _remoteAddress: string = null;

    private debug = Debug("bk:core:peer");

    private _downloadingSegmentId: string | null = null;
    private _downloadingSegment: PeerDataTransmission | null = null;
    private _segmentsMap: BKResourceMap = BKResourceMap.create();
    private _timer: number | null = null;
    private _isSafari11_0: boolean = false;

    constructor(
            private readonly _peerTransport: IPeerTransport,
            readonly settings: {
                p2pSegmentDownloadTimeout: number,
                webRtcMaxMessageSize: number
            }) {
        super();

        this._peerTransport.on("connect", () => this._onPeerConnect());
        this._peerTransport.on("close", () => this._onPeerClose());
        this._peerTransport.on("error", (error: Error) => this.debug("peer error", this._id, error, this));
        this._peerTransport.on("data", this._onPeerData.bind(this));

        this._id = _peerTransport.id;

        this._isSafari11_0 = detectSafari11_0();
    }

    public get id() { return this._id }

    public get remoteAddress(): string {
        return this._remoteAddress;
    }

    public getInfo(): PeerInfo {
        return {
            id: this.id,
            remoteAddress: this.remoteAddress
        };
    }

    public destroy(): void {
        this.debug(`destroying local handle for remote peer (id='${this._id}') -> goodbye mate :)`);
        this._terminateSegmentRequest();
        this._peerTransport.destroy();
    }

    public getDownloadingSegmentId(): string | null {
        return this._downloadingSegmentId;
    }

    public getSegmentsMap(): Map<string, BKResourceStatus> {
        return this._segmentsMap;
    }

    public sendSegmentsMap(segments: BKResourceMapData): void {
        this._sendCommand({"type": PeerCommandType.SegmentsMap, "segments": segments});
    }

    public sendSegmentData(segmentId: string, data: ArrayBuffer): void {
        this._sendCommand({
            type: PeerCommandType.SegmentData,
            segment_id: segmentId,
            segment_size: data.byteLength
        });

        let bytesLeft = data.byteLength;
        while (bytesLeft > 0) {
            const bytesToSend = (bytesLeft >= this.settings.webRtcMaxMessageSize ? this.settings.webRtcMaxMessageSize : bytesLeft);

            const buffer: Buffer = this._isSafari11_0 ?
                Buffer.from(data.slice(data.byteLength - bytesLeft, data.byteLength - bytesLeft + bytesToSend)) : // workaround for Safari 11.0 bug: https://bugs.webkit.org/show_bug.cgi?id=173052
                Buffer.from(data, data.byteLength - bytesLeft, bytesToSend); // avoid memory copying

            this._peerTransport.write(buffer);
            bytesLeft -= bytesToSend;
        }

        this.emit("bytes-uploaded", data.byteLength);
    }

    public sendSegmentAbsent(segmentId: string): void {
        this._sendCommand({type: PeerCommandType.SegmentAbsent, segment_id: segmentId});
    }

    public sendSegmentRequest(segmentId: string): void {
        if (this._downloadingSegmentId) {
            throw new Error("A segment is already downloading: " + this._downloadingSegmentId);
        }

        this._sendCommand({type: PeerCommandType.SegmentRequest, segment_id: segmentId});
        this._downloadingSegmentId = segmentId;
        this._scheduleResponseTimeout();
    }

    public sendCancelSegmentRequest(): void {
        if (this._downloadingSegmentId) {
            const segmentId = this._downloadingSegmentId;
            this._terminateSegmentRequest();
            this._sendCommand({type: PeerCommandType.CancelSegmentRequest, segment_id: segmentId});
        }
    }

    private _sendCommand(command: PeerTransportCommand): void {
        this.debug(`sending command "${command.type}" to remote peer (id='${this._id}') `);
        this._peerTransport.write(JSON.stringify(command));
    }

    private _scheduleResponseTimeout(): void {
        this._timer = window.setTimeout(() => {
            this._timer = null;
            if (!this._downloadingSegmentId) {
                return;
            }
            const segmentId = this._downloadingSegmentId;
            this.sendCancelSegmentRequest();
            this.emit("segment-timeout", this, segmentId); // TODO: send peer not responding event
        }, this.settings.p2pSegmentDownloadTimeout);
    }

    private _cancelResponseTimeout(): void {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    private _terminateSegmentRequest() {
        this._downloadingSegmentId = null;
        this._downloadingSegment = null;
        this._cancelResponseTimeout();
    }

    private _handleSegmentChunk(data: ArrayBuffer): void {

        this.debug(`received resource data from remote peer (id='${this._id}')`);

        if (!this._downloadingSegment) {
            // The segment was not requested or canceled
            this.debug(`received data from remote peer (id='${this._id}') for non-requested or canceled segment :(`);
            return;
        }

        this._downloadingSegment.bytesDownloaded += data.byteLength;
        this._downloadingSegment.chunks.push(data);
        this.emit("bytes-downloaded", data.byteLength);

        const segmentId = this._downloadingSegment.id;

        if (this._downloadingSegment.bytesDownloaded == this._downloadingSegment.size) {
            const segmentData = new Uint8Array(this._downloadingSegment.size);
            let offset = 0;
            for (const chunk of this._downloadingSegment.chunks) {
                segmentData.set(new Uint8Array(chunk), offset);
                offset += chunk.byteLength;
            }

            this.debug("peer resource transfer done", this._id, segmentId, this);
            this._terminateSegmentRequest();
            this.emit("segment-loaded", this, segmentId, segmentData.buffer);
        } else if (this._downloadingSegment.bytesDownloaded > this._downloadingSegment.size) {
            this.debug(`remote peer (id='${this._id}'): transferred resource bytes mismatch!!!`, segmentId);

            console.error("There was a fatal peer transaction error :(");

            this._terminateSegmentRequest();
            this.emit("segment-error", this, segmentId, "Too many bytes received for segment");
        }
    }

    private _onPeerData(data: ArrayBuffer): void {
        const command = decodeMediaPeerTransportCommand(data);
        if (!command) {
            this._handleSegmentChunk(data);
            return;
        }

        if (this._downloadingSegment) {
            this.debug("peer segment download is interrupted by a command", this._id, this);

            const segmentId = this._downloadingSegment.id;
            this._terminateSegmentRequest();
            this.emit("segment-error", this, segmentId, "Segment download is interrupted by a command");
            return;
        }

        this.debug("peer receive command", this._id, command, this);

        switch (command.type) {
            case PeerCommandType.SegmentsMap:
                if (!command.segments) {
                    throw new Error("No `segments` found in data");
                }
                this._segmentsMap = BKResourceMap.create(command.segments);
                this.emit("data-updated");
                break;

            case PeerCommandType.SegmentRequest:
                this.emit("segment-request", this, command.segment_id);
                break;

            case PeerCommandType.SegmentData:
                if (this._downloadingSegmentId === command.segment_id) {
                    if (!command.segment_size) {
                        throw new Error("No `segment_size` found in data");
                    }
                    this._downloadingSegment = new PeerDataTransmission(command.segment_id, command.segment_size);
                    this._cancelResponseTimeout();
                }
                break;

            case PeerCommandType.SegmentAbsent:
                if (this._downloadingSegmentId === command.segment_id) {
                    this._terminateSegmentRequest();
                    this._segmentsMap.delete(command.segment_id);
                    this.emit("segment-absent", this, command.segment_id);
                }
                break;

            case PeerCommandType.CancelSegmentRequest:
                // TODO: peer stop sending buffer
                break;

            default:
                break;
        }
    }

    private _onPeerConnect(): void {
        this.debug(`remote peer (id='${this._id}') connection open`);
        this._remoteAddress = this._peerTransport.remoteAddress;
        this.emit("connect", this);
    }

    private _onPeerClose(): void {
        this.debug(`remote peer (id='${this._id}') connection closed`);
        this._terminateSegmentRequest();
        this.emit("close", this);
    }
}
