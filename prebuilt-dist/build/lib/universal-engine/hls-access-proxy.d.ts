import { TimeIntervalContainer } from '../../ext-mod/emliri-es-libs/rialto/lib/time-intervals';
import { BK_IProxy } from '../core';
import { StringlyTypedEventEmitter } from '../core/stringly-typed-event-emitter';
export declare class HlsAccessProxy extends StringlyTypedEventEmitter<'buffered-range-change'> {
    liveDelaySeconds: number;
    playheadLookaheadSeconds: number;
    private _bkProxy;
    private _mediaStreamConsumer;
    constructor(proxy: BK_IProxy);
    setSource(url: string): void;
    updateFetchTargetRange(playheadPositionSeconds: number): void;
    getBufferedRanges(): TimeIntervalContainer;
    getRequestedRanges(): TimeIntervalContainer;
    isLiveSource(): boolean;
    private _createResourceRequestMaker;
    private _createResourceRequest;
    private _processM3u8File;
    private _onAdaptiveMediaPeriodsParsed;
    private _onSegmentBuffered;
}
