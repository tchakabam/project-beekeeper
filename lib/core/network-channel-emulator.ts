export type NetworkChannelEmulatorDataCb = (data: ArrayBuffer | Buffer | string) => void;

export const MIN_WINDOW_TIME_MS = 40;

export class NetworkChannelEmulatorDataItem {
    constructor(
        public data: string | ArrayBuffer | Buffer,
        public createdAt: number
    ) {}

    get byteLength(): number {
        if (typeof this.data === 'string') {
            return this.data.length;
        }
        return this.data.byteLength;
    }
}

export class NetworkChannelEmulator {
    private _latencyMs: number = 0;
    private _maxBandwidthBps: number = Infinity;
    private _queue: NetworkChannelEmulatorDataItem[] = [];
    private _windowTimeMs: number = MIN_WINDOW_TIME_MS;
    private _pollInterval: number = null;
    private _isFrozen: boolean = true;
    private _lastPolledAt: number = NaN;
    private _outputRate: number = NaN;

    constructor(private _onData: NetworkChannelEmulatorDataCb) {
        this.setFrozen(false);
    }

    setFrozen(frozen, immediateRun: boolean = true) {
        if (frozen === this._isFrozen) {
            return;
        }
        this._isFrozen = frozen;

        if (this._isFrozen) {
            window.clearInterval(this._pollInterval);
            this._pollInterval = null;
            this._lastPolledAt = NaN;
        } else {
            this._pollInterval
                = window.setInterval(this._onPoll.bind(this), this._windowTimeMs);
            if (immediateRun) {
                window.setTimeout(this._onPoll.bind(this), 0);
            }
        }
    }

    push(data: ArrayBuffer | Buffer | string, unfreeze: boolean = true) {
        const now = window.performance.now();
        this._queue.push(new NetworkChannelEmulatorDataItem(
            data,
            now
        ));
        if (unfreeze) {
            this.setFrozen(false);
        }
        if (this._queue.length - 1 === 0) {
            this._onPoll();
        }
    }

    flush(drop: boolean = false) {
        while(this._queue.length > 0) {
            const item = this._queue.shift();
            if (drop) {
                return;
            }
            this._onData(item.data);
        }
    }

    get windowTimeMs() { return this._windowTimeMs; }
    set windowTimeMs(timeMs) { this._windowTimeMs = timeMs; }

    get maxBandwidthBps() { return this._maxBandwidthBps; }
    set maxBandwidthBps(bwKbps) { this._maxBandwidthBps = bwKbps; }

    get latencyMs() { return this._latencyMs; }
    set latencyMs(latencyMs) { this._latencyMs = latencyMs; }

    private _getQueuedBandwidth() {
        if (!this._queue.length) {
            return 0;
        }

        const now = window.performance.now();
        const timeDiffMs = now - this._queue[0].createdAt;

        const bytesTotal = this._queue.reduce((previousValue, currentValue) => {
            previousValue += currentValue.byteLength;
            return previousValue;
        }, 0);

        return 8 * bytesTotal / (timeDiffMs / 1000);
    }

    private _onPoll() {
        //console.log('_onPoll');

        const queueBw = this._getQueuedBandwidth();
        const now = window.performance.now();
        const queue = this._queue;
        const latencyMs = this._latencyMs;
        const maxBandwidthBps = this._maxBandwidthBps;

        let windowTimeEffectiveMs = this._windowTimeMs;
        this._lastPolledAt = now;

        const maxBytesInWindow = (this._maxBandwidthBps / 8) * (windowTimeEffectiveMs / 1000);

        /*
        console.log('window ms:', windowTimeEffectiveMs);
        console.log('max bytes in window:', maxBytesInWindow);
        console.log('queue bw:', queueBw);
        */

        let pushedBytes = 0;
        function shouldPushNext() {
            if (!queue.length) {
                return false;
            }
            return (maxBytesInWindow >= pushedBytes + queue[0].byteLength
                && latencyMs <= now - queue[0].createdAt)
                || queueBw <= maxBandwidthBps;
        }

        while (shouldPushNext()) {

            const item = this._queue.shift();
            pushedBytes += item.byteLength;

            // dispatch this so we don't block
            //setTimeout(() => this._onData(item.data), 0);

            this._onData(item.data);
        }

        if (queue.length === 0) {
            this.setFrozen(true);
        }

        this._outputRate = pushedBytes / (windowTimeEffectiveMs / 1000);

        //console.log('output rate:', this._outputRate);
    }
}
