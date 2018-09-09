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

class PeerDataTransmission {
    public bytesDownloaded = 0;
    public chunks: ArrayBuffer[] = [];

    constructor(readonly id: string, readonly size: number) {}
}

export class Peer extends StringlyTypedEventEmitter<
    // TODO: make proper enum for these events
    "connect" | "close" | "data-updated" |
    "segment-request" | "segment-absent" |
    "segment-loaded" | "segment-error" |
    "segment-timeout" |
    "bytes-downloaded" | "bytes-uploaded"
> {

    public id: string;
    public remoteAddress: string = "";

    private debug = Debug("bk:core:peer");

    private downloadingSegmentId: string | null = null;
    private downloadingSegment: PeerDataTransmission | null = null;
    private segmentsMap: BKResourceMap = BKResourceMap.create();
    private timer: number | null = null;
    private isSafari11_0: boolean = false;

    constructor(
            private readonly peer: IPeerTransport,
            readonly settings: {
                p2pSegmentDownloadTimeout: number,
                webRtcMaxMessageSize: number
            }) {
        super();

        this.peer.on("connect", () => this.onPeerConnect());
        this.peer.on("close", () => this.onPeerClose());
        this.peer.on("error", (error: Error) => this.debug("peer error", this.id, error, this));
        this.peer.on("data", this.onPeerData.bind(this));

        this.id = peer.id;

        this.isSafari11_0 = detectSafari11_0();
    }

    private onPeerConnect(): void {
        this.debug(`remote peer (id='${this.id}') connection open`);
        this.remoteAddress = this.peer.remoteAddress;
        this.emit("connect", this);
    }

    private onPeerClose(): void {
        this.debug(`remote peer (id='${this.id}') connection closed`);
        this.terminateSegmentRequest();
        this.emit("close", this);
    }

    private handleSegmentChunk(data: ArrayBuffer): void {

        this.debug(`received resource data from remote peer (id='${this.id}')`);

        if (!this.downloadingSegment) {
            // The segment was not requested or canceled
            this.debug(`received data from remote peer (id='${this.id}') for non-requested or canceled segment :(`);
            return;
        }

        this.downloadingSegment.bytesDownloaded += data.byteLength;
        this.downloadingSegment.chunks.push(data);
        this.emit("bytes-downloaded", data.byteLength);

        const segmentId = this.downloadingSegment.id;

        if (this.downloadingSegment.bytesDownloaded == this.downloadingSegment.size) {
            const segmentData = new Uint8Array(this.downloadingSegment.size);
            let offset = 0;
            for (const chunk of this.downloadingSegment.chunks) {
                segmentData.set(new Uint8Array(chunk), offset);
                offset += chunk.byteLength;
            }

            this.debug("peer resource transfer done", this.id, segmentId, this);
            this.terminateSegmentRequest();
            this.emit("segment-loaded", this, segmentId, segmentData.buffer);
        } else if (this.downloadingSegment.bytesDownloaded > this.downloadingSegment.size) {
            this.debug(`remote peer (id='${this.id}'): transferred resource bytes mismatch!!!`, segmentId);

            console.error("There was a fatal peer transaction error :(");

            this.terminateSegmentRequest();
            this.emit("segment-error", this, segmentId, "Too many bytes received for segment");
        }
    }

    private onPeerData(data: ArrayBuffer): void {
        const command = decodeMediaPeerTransportCommand(data);
        if (!command) {
            this.handleSegmentChunk(data);
            return;
        }

        if (this.downloadingSegment) {
            this.debug("peer segment download is interrupted by a command", this.id, this);

            const segmentId = this.downloadingSegment.id;
            this.terminateSegmentRequest();
            this.emit("segment-error", this, segmentId, "Segment download is interrupted by a command");
            return;
        }

        this.debug("peer receive command", this.id, command, this);

        switch (command.type) {
            case PeerCommandType.SegmentsMap:
                if (!command.segments) {
                    throw new Error("No `segments` found in data");
                }
                this.segmentsMap = BKResourceMap.create(command.segments);
                this.emit("data-updated");
                break;

            case PeerCommandType.SegmentRequest:
                this.emit("segment-request", this, command.segment_id);
                break;

            case PeerCommandType.SegmentData:
                if (this.downloadingSegmentId === command.segment_id) {
                    if (!command.segment_size) {
                        throw new Error("No `segment_size` found in data");
                    }
                    this.downloadingSegment = new PeerDataTransmission(command.segment_id, command.segment_size);
                    this.cancelResponseTimeoutTimer();
                }
                break;

            case PeerCommandType.SegmentAbsent:
                if (this.downloadingSegmentId === command.segment_id) {
                    this.terminateSegmentRequest();
                    this.segmentsMap.delete(command.segment_id);
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

    private sendCommand(command: PeerTransportCommand): void {
        this.debug(`sending command "${command.type}" to remote peer (id='${this.id}') `);
        this.peer.write(JSON.stringify(command));
    }

    public destroy(): void {
        this.debug(`destroying local handle for remote peer (id='${this.id}') -> goodbye mate :)`);
        this.terminateSegmentRequest();
        this.peer.destroy();
    }

    public getDownloadingSegmentId(): string | null {
        return this.downloadingSegmentId;
    }

    public getSegmentsMap(): Map<string, BKResourceStatus> {
        return this.segmentsMap;
    }

    public sendSegmentsMap(segments: BKResourceMapData): void {
        this.sendCommand({"type": PeerCommandType.SegmentsMap, "segments": segments});
    }

    public sendSegmentData(segmentId: string, data: ArrayBuffer): void {
        this.sendCommand({
            type: PeerCommandType.SegmentData,
            segment_id: segmentId,
            segment_size: data.byteLength
        });

        let bytesLeft = data.byteLength;
        while (bytesLeft > 0) {
            const bytesToSend = (bytesLeft >= this.settings.webRtcMaxMessageSize ? this.settings.webRtcMaxMessageSize : bytesLeft);

            const buffer: Buffer = this.isSafari11_0 ?
                Buffer.from(data.slice(data.byteLength - bytesLeft, data.byteLength - bytesLeft + bytesToSend)) : // workaround for Safari 11.0 bug: https://bugs.webkit.org/show_bug.cgi?id=173052
                Buffer.from(data, data.byteLength - bytesLeft, bytesToSend); // avoid memory copying

            this.peer.write(buffer);
            bytesLeft -= bytesToSend;
        }

        this.emit("bytes-uploaded", data.byteLength);
    }

    public sendSegmentAbsent(segmentId: string): void {
        this.sendCommand({type: PeerCommandType.SegmentAbsent, segment_id: segmentId});
    }

    public requestSegment(segmentId: string): void {
        if (this.downloadingSegmentId) {
            throw new Error("A segment is already downloading: " + this.downloadingSegmentId);
        }

        this.sendCommand({type: PeerCommandType.SegmentRequest, segment_id: segmentId});
        this.downloadingSegmentId = segmentId;
        this.runResponseTimeoutTimer();
    }

    public cancelSegmentRequest(): void {
        if (this.downloadingSegmentId) {
            const segmentId = this.downloadingSegmentId;
            this.terminateSegmentRequest();
            this.sendCommand({type: PeerCommandType.CancelSegmentRequest, segment_id: segmentId});
        }
    }

    private runResponseTimeoutTimer(): void {
        this.timer = window.setTimeout(() => {
            this.timer = null;
            if (!this.downloadingSegmentId) {
                return;
            }
            const segmentId = this.downloadingSegmentId;
            this.cancelSegmentRequest();
            this.emit("segment-timeout", this, segmentId); // TODO: send peer not responding event
        }, this.settings.p2pSegmentDownloadTimeout);
    }

    private cancelResponseTimeoutTimer(): void {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    private terminateSegmentRequest() {
        this.downloadingSegmentId = null;
        this.downloadingSegment = null;
        this.cancelResponseTimeoutTimer();
    }
}
