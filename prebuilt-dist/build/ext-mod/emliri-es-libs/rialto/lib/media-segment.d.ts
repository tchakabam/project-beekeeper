import { Resource, DecryptableResource } from './resource';
import { MediaLocator, MediaClockTime } from './media-locator';
import { MediaContainer, MediaContainerInfo } from './media-container-info';
import { TimeInterval } from './time-intervals';
/**
 *
 * Represents a time-bound segment of a media
 *
 * @fires fetch:aborted
 * @fires fetch:progress
 * @fires fetch:errored
 * @fires fetch:succeeded
 *
 * @fires buffer:set
 * @fires buffer:clear
 */
export declare class MediaSegment extends Resource implements MediaContainer, DecryptableResource {
    cached: boolean;
    private locator_;
    private timeOffset_;
    private ordinalIndex_;
    mediaContainerInfo: MediaContainerInfo;
    constructor(locator: MediaLocator, mimeType?: string, cached?: boolean);
    hasBeenParsed(): boolean;
    parse(): Promise<this>;
    decrypt(): any;
    getTimeInterval(): TimeInterval;
    setTimeOffset(o: number): void;
    getTimeOffset(): number;
    setOrdinalIndex(i: number): void;
    getOrdinalIndex(): number;
    readonly duration: MediaClockTime;
    readonly startTime: MediaClockTime;
    readonly endTime: MediaClockTime;
}
