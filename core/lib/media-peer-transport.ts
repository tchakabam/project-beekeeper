import { StringlyTypedEventEmitter } from "./stringly-typed-event-emitter";

import * as Debug from "debug";
import { MediaSegmentsMapData } from "./media-segment";

const debug = Debug("p2pml:media-peer-transport");

export enum MediaPeerCommandType {
    SegmentData = "segment_data",
    SegmentAbsent = "segment_absent",
    SegmentsMap = "segments_map",
    SegmentRequest = "segment_request",
    CancelSegmentRequest = "cancel_segment_request",
}

export type MediaPeerTransportCommand = {
    command: MediaPeerCommandType
    segment_id?: string
    segment_size?: number
    segments?: MediaSegmentsMapData
}

// TODO: marshall parsed data
export function decodeMediaPeerTransportCommand(data: ArrayBuffer): MediaPeerTransportCommand | null {
    const bytes = new Uint8Array(data);
    // Serialized JSON string check by first, second and last characters: '{" .... }'
    if (bytes[0] == 123 && bytes[1] == 34 && bytes[data.byteLength - 1] == 125) {
        try {
            return JSON.parse(new TextDecoder("utf-8").decode(data));
        } catch {
        }
    }
    return null;
}

export interface IMediaPeerTransport {
    readonly id: string;
    readonly remoteAddress: string;

    write(buffer: Buffer | string): void;

    on(event: "connect" | "close", handler: () => void): void;
    on(event: "error", handler: (error: Error) => void): void;
    on(event: "data", handler: (data: ArrayBuffer) => void): void;

    destroy(): void;
}

export type MediaPeerTransportFilterFactory = (transport: IMediaPeerTransport) => IMediaPeerTransport;

export class DefaultMediaPeerTransportFilter
    extends StringlyTypedEventEmitter<"connect" | "close" | "error" | "data">
    implements IMediaPeerTransport {

    constructor(private _transport: IMediaPeerTransport) {
        super();

        this._transport.on("connect", () => this._onConnect());
        this._transport.on("close", () => this._onClose());
        this._transport.on("error", (error) => this._onError(error));
        this._transport.on("data", (data) => this._onData(data));
    }

    get id(): string {
        return this._transport.id;
    }

    get remoteAddress(): string {
        return this._transport.remoteAddress;
    }

    write(buffer: string | Buffer): void {
        if (typeof buffer === "string") {
            debug(`write call to peer ${this.id} with string: ${buffer}`);
        } else {
            debug(`write call peer ${this.id} with Buffer object, byte-length is ${buffer.byteLength}`)
        }
        this._transport.write(buffer);
    }

    destroy(): void {
        this._transport.destroy();
    }

    private _onConnect() {
        debug("connect")
        this.emit("connect");
    }

    private _onClose() {
        debug("close")
        this.emit("close")
    }

    private _onError(error: Error) {
        debug("error")
        this.emit("error", error);
    }

    private _onData(data: ArrayBuffer) {
        debug("data")
        this.emit("data", data);
    }
}
