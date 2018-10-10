import { MediaSegment } from './media-segment';
export declare type SourceBufferQueueItem = {
    method: string;
    arrayBuffer?: ArrayBuffer;
    timestampOffset?: number;
    start?: number;
    end?: number;
};
export declare type SourceBufferQueueUpdateCallbackData = {
    updateTimeMs: number;
};
export declare type SourceBufferQueueUpdateCallback = (SourceBufferQueue: any, SourceBufferQueueUpdateCallbackData: any) => void;
export declare class SourceBufferQueue {
    private mimeType_;
    private updateStartedTime_;
    private queue_;
    private bufferedBytesCount_;
    private sourceBuffer_;
    private initialMode_;
    private onUpdate_;
    private bufferMap_;
    constructor(mediaSource: MediaSource, mimeType: string, trackDefaults?: any, onUpdate?: SourceBufferQueueUpdateCallback);
    readonly mimeType: string;
    readonly bufferedBytesCount: number;
    isInitialModeSequential(): boolean;
    getMode(): string;
    setModeSequential(sequentialModeEnable: any): void;
    isUpdating(): boolean;
    getBufferedTimeranges(mediaTimeOffset: any): TimeRanges;
    getTotalBytesQueued(): number;
    getTotalBytes(): number;
    getItemsQueuedCount(filterMethod: string): number;
    appendBuffer(arrayBuffer: ArrayBuffer, timestampOffset: number): void;
    appendMediaSegment(segment: MediaSegment): void;
    remove(start: any, end: any): void;
    dropAsync(): void;
    drop(immediateAbort: any): void;
    flush(): void;
    dropAndFlush(): void;
    private incrBufferedBytesCnt_;
    private decBufferedBytesCnt_;
    private tryRunQueueOnce_;
    private onUpdateEnd_;
    private onUpdateStart_;
}
