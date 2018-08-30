import * as Debug from "debug";

import { BK_IProxy, BKResource, Events } from "../../../core/lib";
import { Queue } from "../../../ext-mod/emliri-es-libs/rialto/lib/queue";

const debug = Debug("p2pml:universal:downloader-queue");

/**
 * Core implementation requires us to maintain this queue, as it will abort
 * requests that are not in the list of segments passed in the latest `load` call.
 *
 * In a way, the core expects us to maintain a queue, and update it with this whole queue
 * everytime we want to load a new segment.
 *
 * This object allows to maintain that queue and have other components "just" request _one_ segment
 * independent of that there are other requests happening or not.
 */
export class P2PDownloaderQueue implements BK_IProxy {

    private _queue: Queue<BKResource> = new Queue();

    constructor(private _downloader: BK_IProxy) {
        this._downloader.on(Events.SegmentLoaded, this.onSegmentLoaded.bind(this));
        this._downloader.on(Events.SegmentError, this.onSegmentError.bind(this));
        this._downloader.on(Events.SegmentAbort, this.onSegmentAbort.bind(this));
    }

    on(event: string | symbol, listener: (...args: any[]) => void): BK_IProxy {
        return this._downloader.on(event, listener);
    }

    load(segments: BKResource[], swarmId: string): void {
        segments.reverse().forEach((segment) => this._queue.enqueue(segment));
        this._downloader.load(this._queue.getArray(), swarmId);
    }

    destroy(): void {
        this._downloader.destroy();
    }

    private _removeResourceFromQueue(resource: BKResource) {
        this._queue.getArray().forEach((resource) => {
            if (resource.id === resource.id) {
                const res = this._queue.removeAll(resource);
                if (res !== 1) {
                    throw new Error(`Queue inconsistency, expected to remove one, but found ${res}`);
                }
            }
        });
        debug(`removed resource ${resource.id} from queue`);
    }

    private onSegmentLoaded(resource: BKResource) {
        debug(`p2p resource loaded: ${resource.uri}`);
        this._removeResourceFromQueue(resource);
    }

    private onSegmentError(resource: BKResource, err: Error) {
        console.warn("P2P resource errored", err)
        this._removeResourceFromQueue(resource);
    }

    private onSegmentAbort(resource: BKResource) {
        console.warn("P2P resource aborted", resource)
        this._removeResourceFromQueue(resource);
    }
}
