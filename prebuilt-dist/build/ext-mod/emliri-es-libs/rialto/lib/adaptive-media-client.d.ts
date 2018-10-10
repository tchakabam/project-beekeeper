import { AdaptiveMedia, AdaptiveMediaSet } from "./adaptive-media";
import { MediaSegment } from "./media-segment";
import { TimeIntervalContainer, TimeInterval } from './time-intervals';
export declare abstract class AdaptiveMediaClient implements AdaptiveMediaEngine {
    private mediaEl;
    constructor(mediaElement: HTMLMediaElement);
    readonly mediaElement: HTMLMediaElement;
    protected setMediaSource(source: MediaSource): void;
    abstract setSourceURL(url: string, mimeType?: string): any;
    abstract activateMediaStream(stream: AdaptiveMedia): Promise<boolean>;
    abstract enableMediaSet(set: AdaptiveMediaSet): any;
}
export interface AdaptiveMediaEngine {
    enableMediaSet(set: AdaptiveMediaSet): any;
    activateMediaStream(stream: AdaptiveMedia): Promise<boolean>;
}
export declare class AdaptiveMediaStreamConsumer {
    private _adaptiveMedia;
    private _onSegmentBufferedCb;
    private _fetchTargetRanges;
    private _bufferedRanges;
    constructor(_adaptiveMedia: AdaptiveMedia, _onSegmentBufferedCb: (segment: MediaSegment) => void);
    getMedia(): AdaptiveMedia;
    getBufferedRanges(): TimeIntervalContainer;
    getFetchTargetRanges(): TimeIntervalContainer;
    setFetchTarget(time: number): void;
    /**
     *
     * @param floor when passed negative number, floor is calculated from end of media (useful for live/DVR window)
     * @param ceiling
     */
    setFetchFloorCeiling(floor?: number, ceiling?: number): void;
    /**
     *
     * @param range pass `null` to just reset to clear range container
     */
    setFetchTargetRange(range: TimeInterval): void;
    addFetchTargetRange(range: TimeInterval): void;
    private _onFetchTargetRangeChanged;
    private _fetchAllSegmentsInTargetRange;
}
