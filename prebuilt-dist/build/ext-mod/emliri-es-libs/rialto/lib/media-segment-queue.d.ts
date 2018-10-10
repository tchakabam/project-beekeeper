import { MediaSegment } from './media-segment';
import { Resource } from './resource';
import { Queue } from './queue';
/**
 * @fires fetch-all:done
 * @fires fetch-next:done
 * @fires fetch-next:error
 */
export declare class MediaSegmentQueue extends Queue<MediaSegment> {
    private _nextFetchPromise;
    constructor();
    readonly nextFetchPromise: Promise<Resource>;
    fetchAll(): void;
    /**
     * Traverse queue and fetches first segment that has no data yet
     *
     */
    fetchNext(): Promise<Resource>;
}
