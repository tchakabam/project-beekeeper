/// <reference types="node" />
import { StringlyTypedEventEmitter } from './stringly-typed-event-emitter';
import { BKResourceMapData } from './bk-resource';
export declare enum PeerCommandType {
    SegmentData = "segment_data",
    SegmentAbsent = "segment_absent",
    SegmentsMap = "segments_map",
    SegmentRequest = "segment_request",
    CancelSegmentRequest = "cancel_segment_request"
}
export declare type PeerTransportCommand = {
    type: PeerCommandType;
    segment_id?: string;
    segment_size?: number;
    segments?: BKResourceMapData;
};
export declare function decodeMediaPeerTransportCommand(data: ArrayBuffer): PeerTransportCommand | null;
export interface IPeerTransport {
    readonly id: string;
    readonly remoteAddress: string;
    write(buffer: Buffer | string): void;
    on(event: "connect" | "close", handler: () => void): void;
    on(event: "error", handler: (error: Error) => void): void;
    on(event: "data", handler: (data: ArrayBuffer) => void): void;
    destroy(): void;
    setMaxBandwidthBps(n: number): boolean;
    setMinLatencyMs(n: number): boolean;
}
export declare type PeerTransportFilterFactory = (transport: IPeerTransport) => IPeerTransport;
export declare class DefaultPeerTransportFilter extends StringlyTypedEventEmitter<"connect" | "close" | "error" | "data"> implements IPeerTransport {
    private _transport;
    private _netEmIn;
    private _netEmOut;
    constructor(_transport: IPeerTransport);
    readonly id: string;
    readonly remoteAddress: string;
    write(buffer: string | Buffer): void;
    destroy(): void;
    setMaxBandwidthBps(n: number): boolean;
    setMinLatencyMs(n: number): boolean;
    private _onConnect;
    private _onClose;
    private _onError;
    private _onData;
    private _onNetChannelInData;
    private _onNetChannelOutData;
}
