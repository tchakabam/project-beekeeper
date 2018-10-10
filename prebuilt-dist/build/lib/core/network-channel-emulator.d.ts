/// <reference types="node" />
export declare type NetworkChannelEmulatorDataCb = (data: ArrayBuffer | Buffer | string) => void;
export declare const MIN_WINDOW_TIME_MS = 40;
export declare class NetworkChannelEmulatorDataItem {
    data: string | ArrayBuffer | Buffer;
    createdAt: number;
    constructor(data: string | ArrayBuffer | Buffer, createdAt: number);
    readonly byteLength: number;
}
export declare class NetworkChannelEmulator {
    private _onData;
    private _latencyMs;
    private _maxBandwidthBps;
    private _queue;
    private _windowTimeMs;
    private _pollInterval;
    private _isFrozen;
    private _lastPolledAt;
    private _outputRate;
    constructor(_onData: NetworkChannelEmulatorDataCb);
    setFrozen(frozen: any, immediateRun?: boolean): void;
    push(data: ArrayBuffer | Buffer | string, unfreeze?: boolean): void;
    flush(drop?: boolean): void;
    windowTimeMs: number;
    maxBandwidthBps: number;
    latencyMs: number;
    private _getQueuedBandwidth;
    private _onPoll;
}
