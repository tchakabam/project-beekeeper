import { BK_IProxy, BKOptAccessProxySettings } from '../core';
import { VirtualPlayhead } from './virtual-playhead';
export declare class Engine {
    static isSupported(): boolean;
    private _proxy;
    private _sourceUrl;
    private _hlsProxy;
    private _playhead;
    private _gotEarliestRequestedRangeBuffered;
    private _monitorDomView;
    constructor(settings?: BKOptAccessProxySettings);
    getProxy(): BK_IProxy;
    getPlayhead(): VirtualPlayhead;
    getPeerId(): string;
    getSwarmId(): string;
    destroy(): void;
    setSource(url: string): void;
    start(): void;
    setMaxLiveDelaySeconds(maxLiveDelaySeconds: number): void;
    setMaxPlayheadLookaheadSeconds(maxPlayheadLookaheadSeconds: number): void;
    setNetemPeerMaxKbps(kbpsMaxBw: number): void;
}
