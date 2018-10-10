import { StringlyTypedEventEmitter } from '../core/stringly-typed-event-emitter';
import { TimeIntervalContainer } from '../../ext-mod/emliri-es-libs/rialto/lib/time-intervals';
export declare const UPDATE_PERIOD_MS = 500;
export declare type VirtualPlayheadUpdateCb = (playhead: VirtualPlayhead) => void;
export declare class VirtualPlayhead extends StringlyTypedEventEmitter<'update'> {
    private _onUpdate;
    private _clockTime;
    private _updateIntervalTimer;
    private _isPlaying;
    private _updateCalledAt;
    private _isSpinning;
    private _bufferedTimeRanges;
    private _timeScale;
    constructor(_onUpdate?: VirtualPlayheadUpdateCb);
    play(): void;
    pause(): void;
    /**
     *
     * @param time clock time in seconds
     */
    setCurrentTime(time: number): void;
    /**
     * @returns clock time in seconds
     */
    getCurrentTime(): number;
    /**
     * Should be understood as `isPlaying()´, indicating the intention of spinning
     * while it can be pushed, while not spinning because data is lacking.
     */
    isPushed(): boolean;
    /**
     * Whether the tape is moving
     */
    isSpinning(): boolean;
    getBufferedRanges(): TimeIntervalContainer;
    setBufferedRanges(ranges: TimeIntervalContainer): void;
    private _onUpdateTimer;
}
