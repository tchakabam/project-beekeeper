import { StringlyTypedEventEmitter } from '../../../core/lib/stringly-typed-event-emitter';

const perf = window.performance;

export const UPDATE_PERIOD_MS = 500;

export class VirtualPlayhead extends StringlyTypedEventEmitter<'update'> {

    private _clockTime: number = 0;
    private _updateIntervalTimer: number = null;
    private _isPlaying: boolean;
    private _updateCalledAt: number = null;

    constructor(
        private _onUpdate: (playhead: VirtualPlayhead) => void = null
    ){
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

    setCurrentTime(time: number) {
        this._clockTime = time * 1000;
    }

    getCurrentTime(): number {
        return this._clockTime / 1000;
    }

    /**
     * Should be understand as `isPlaying()´
     */
    isPushed(): boolean {
        return this._isPlaying;
    }

    /**
     * Wether the tape is moving
     */
    isSpinning() {

    }

    private _onUpdateTimer() {
        const lastCalledAt = this._updateCalledAt;
        this._updateCalledAt = perf.now();

        if (lastCalledAt !== null) {
            this._clockTime += (this._updateCalledAt - lastCalledAt);
        }

        if (this._onUpdate) {
            this._onUpdate(this);
        }

        this.emit('update');
    }
}
