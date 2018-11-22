import { TypedEventEmitter } from '../core/typed-event-emitter';
import { TimeIntervalContainer } from '../../ext-mod/emliri-es-libs/rialto/lib/time-intervals';
import { TimeScale } from '../../ext-mod/emliri-es-libs/rialto/lib/time-scale';

import * as Debug from 'debug';

const debug = Debug('bk:engine:universal:virtual-playhead');

const perf = window.performance;

export const UPDATE_PERIOD_MS = 500;

export type VirtualPlayheadUpdateCb = (playhead: VirtualPlayhead) => void;

export class VirtualPlayhead extends TypedEventEmitter<'update'> {

    private _clockTime: number = 0;
    private _updateIntervalTimer: number = null;
    private _isPlaying: boolean = false;
    private _updateCalledAt: number = null;
    private _isSpinning: boolean = false;
    private _bufferedTimeRanges: TimeIntervalContainer = new TimeIntervalContainer();
    private _timeScale: TimeScale = new TimeScale(1/1000)

    constructor(
        private _onUpdate: VirtualPlayheadUpdateCb = null
    ) {
        super();
    }

    play() {
        if (this._isPlaying) {
            return;
        }
        this._isPlaying = true;
        this._onUpdateTimer();
        this._updateIntervalTimer = window.setInterval(() => this._onUpdateTimer(), UPDATE_PERIOD_MS);
    }

    pause() {
        if (!this._isPlaying) {
            return;
        }
        this._isPlaying = false;
        this._updateCalledAt = null;
        window.clearInterval(this._updateIntervalTimer);
        this._updateIntervalTimer = null;

        this._onUpdateTimer();
    }

    /**
     *
     * @param time clock time in seconds
     */
    setCurrentTime(time: number) {
        this._clockTime = this._timeScale.denormalize(time);
    }

    /**
     * @returns clock time in seconds
     */
    getCurrentTime(): number {
        return this._timeScale.normalize(this._clockTime);
    }

    /**
     * Should be understood as `isPlaying()´, indicating the intention of spinning
     * while it can be pushed, while not spinning because data is lacking.
     */
    isPushed(): boolean {
        return this._isPlaying;
    }

    /**
     * Whether the tape is moving
     */
    isSpinning() {
        return this._isSpinning;
    }

    getBufferedRanges(): TimeIntervalContainer {
        return this._bufferedTimeRanges;
    }

    setBufferedRanges(ranges: TimeIntervalContainer) {

        debug('update buffered time-ranges');

        this._bufferedTimeRanges = ranges;

        if (!this._isSpinning) {
            this._onUpdateTimer();
        }

    }

    private _onUpdateTimer() {
        const lastCalledAt = this._updateCalledAt;
        this._updateCalledAt = perf.now();

        if (!this._isPlaying) {
            this._isSpinning = false;
            return;
        }

        if (lastCalledAt !== null && this._isSpinning) {
            this._clockTime += (this._updateCalledAt - lastCalledAt);
        }

        if (!this._isSpinning) {
            this._updateCalledAt = null;
        }

        this._isSpinning
            = this._bufferedTimeRanges.hasIntervalsWith(this.getCurrentTime());

        if (this._onUpdate) {
            this._onUpdate(this);
        }

        this.emit('update');
    }
}
