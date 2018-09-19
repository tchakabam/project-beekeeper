export type NetworkChannelEmulatorDataCb = (data: ArrayBuffer | Buffer | string) => void

export const MIN_WINDOW_TIME_MS = 1000;

export class NetworkChannelEmulatorDataItem {
    constructor(
        public data: string | ArrayBuffer | Buffer,
        public createdAt: number
    ) {}

    get byteLength(): number {
        if (typeof this.data === "string") {
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

    constructor(private _onData: NetworkChannelEmulatorDataCb) {
        this.setFrozen(false);
    }

    setFrozen(frozen) {
        if (frozen === this._isFrozen) {
            return;
        }
        this._isFrozen = frozen;

        if (this._isFrozen) {
            window.clearInterval(this._pollInterval);
            this._pollInterval = null;
        } else {
            this._pollInterval
                = window.setInterval(this._onPoll.bind(this), this._windowTimeMs);
        }
    }

    push(data: ArrayBuffer | Buffer | string) {
        this._queue.push(new NetworkChannelEmulatorDataItem(
            data,
            window.performance.now()
        ));
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

    private _onPoll() {

        console.log('_onPoll')

        const queue = this._queue;
        const latencyMs = this._latencyMs;
        const maxBytesInWindow = (this._maxBandwidthBps / 8) * (this._windowTimeMs / 1000) ;
        let pushedBytes = 0;
        while (
            queue.length > 0
            && maxBytesInWindow > pushedBytes + queue[0].byteLength
            && latencyMs < window.performance.now() - queue[0].createdAt) {

            const item = this._queue.shift();
            pushedBytes += item.byteLength;
            this._onData(item.data);
        }
    }
};
