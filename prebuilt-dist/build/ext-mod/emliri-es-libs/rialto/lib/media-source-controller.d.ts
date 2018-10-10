import { EventEmitter } from 'eventemitter3';
import { SourceBufferQueue } from './source-buffer-queue';
export declare enum MediaSourceControllerEvents {
    MEDIA_CLOCK_UPDATED = "media-clock-updated",
    MEDIA_DURATION_CHANGED = "media-duration-changed",
    MEDIA_STALLED = "media-stalling"
}
export declare class MediaSourceController extends EventEmitter {
    private mediaSource_;
    private sourceBufferQueues_;
    private mediaDuration_;
    private mediaClockTime_;
    private mediaClockLastUpdateTime_;
    constructor(mediaSource?: MediaSource);
    readonly mediaDuration: number;
    readonly mediaClockTime: number;
    readonly mediaSource: MediaSource;
    readonly sourceBufferQueues: SourceBufferQueue[];
    addSourceBufferQueue(mimeType: string): boolean;
    getSourceBufferQueuesByMimeType(mimeType: any): SourceBufferQueue[];
    getBufferedTimeRanges(mediaOffset: any): TimeRanges[];
    getBufferedTimeRangesFromMediaPosition(): TimeRanges[];
    updateMediaClockTime(clockTime: any): void;
    setMediaDuration(duration: any): void;
    onSourceBufferQueueUpdateCb_(SourceBufferQueue: any, SourceBufferQueueUpdateCallbackData: any): void;
}
