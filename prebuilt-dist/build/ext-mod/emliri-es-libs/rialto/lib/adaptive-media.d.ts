import { CloneableScaffold } from "./cloneable";
import { Set } from "../../objec-ts/lib/es6-set";
import { MediaSegment } from './media-segment';
import { VideoInfo, AudioInfo, TextInfo, MediaContainer, MediaContainerInfo, MediaTypeSet } from './media-container-info';
import { ByteRange } from './byte-range';
import { AdaptiveMediaEngine } from './adaptive-media-client';
import { MediaClockTime } from "./media-locator";
import { TimeIntervalContainer, TimeInterval } from "./time-intervals";
/**
 * Essentially, a sequence of media segments that can be consumed as a stream.
 *
 * Represents what people refer to as rendition, quality level or representation, or media "variant" playlist.
 *
 * Contains an array of segments and the metadata in common about these.
 */
export declare class AdaptiveMedia extends CloneableScaffold<AdaptiveMedia> {
    mediaEngine: AdaptiveMediaEngine;
    private _segments;
    private _timeRanges;
    private _lastRefreshAt;
    private _lastTimeRangesCreatedAt;
    private _updateTimer;
    constructor(mediaEngine?: AdaptiveMediaEngine);
    parent: AdaptiveMediaSet;
    mimeType: string;
    codecs: string;
    bandwidth: number;
    videoInfo: VideoInfo;
    audioInfo: AudioInfo;
    textInfo: TextInfo;
    isLive: boolean;
    /**
     * Some label indentifying the logical function for the user this media selection has. HLS uses `NAME`, DASH has `role(s)`.
     *
     * This SHOULD be identical for redundant selections/streams (carrying the same content but in different sets to allow
     * backup / fallback strategies).
     *
     * It SHOULD be different for streams with different function or "role" (as in DASH spec).
     *
     * Examples: Original-Audio vs Director-Comments or English-Subtitles vs Forced-CC etc.
     */
    label: string;
    /**
     * If the media segments come in a packetized format, indicate the ID within
     * the package stream that specifies the payload stream described here.
     */
    packageStreamId: number;
    /**
     * Uri/ByteRange of segment index i.e where to enrich our segment list
     */
    segmentIndexUri: string;
    segmentIndexRange: ByteRange;
    segmentIndexProvider: () => Promise<MediaSegment[]>;
    /**
     * If this is an alternate rendition media for example in HLS the group-ID,
     * it is what may be used to group various media together into a set
     * which is supposed to be rendered into coherent content
     * (eg various audio/text stream options timed against a video stream).
     */
    externalReferenceId: string;
    /**
     * Like sequence-no in HLS, or DASH template index
     */
    externalIndex: number;
    /**
     * tamper-safe copy of internal data
     */
    readonly segments: MediaSegment[];
    readonly lastRefreshedAt: number;
    addSegment(mediaSegment: MediaSegment, reorderAndDedupe?: boolean): void;
    getUrl(): string;
    getEarliestTimestamp(): MediaClockTime;
    getMeanSegmentDuration(): number;
    /**
     * @returns duration as sum of all segment durations. will be equal to window duration
     * if the media is gapless and has no time-plane discontinuities.
     */
    getCumulatedDuration(): MediaClockTime;
    /**
     * @returns duration as difference between last segment endTime and first segment startTime
     */
    getWindowDuration(): MediaClockTime;
    /**
     * Refresh/enrich media segments (e.g for external segment indices and for live)
     */
    refresh(autoReschedule?: boolean, onSegmentsUpdate?: () => void): Promise<AdaptiveMedia>;
    scheduleUpdate(timeSeconds: number, onRefresh?: () => void): void;
    /**
     * Activates/enables this media with the attached engine
     */
    activate(): Promise<boolean>;
    getSeekableTimeRanges(): TimeIntervalContainer;
    /**
     *
     * @param range
     * @param partial
     * @returns segments array which are fully contained inside `range` (or only overlap when `partial` is true)
     */
    findSegmentsForTimeRange(range: TimeInterval, partial?: boolean): MediaSegment[];
    private _updateTimeRanges;
    private _updateSegments;
}
/**
 * A set of segmented adaptive media stream representations with a given combination of content-types (see flags).
 *
 * This might be a valid playable combination of tracks (of which some might be optional).
 */
export declare class AdaptiveMediaSet extends Set<AdaptiveMedia> implements MediaContainer {
    parent: AdaptiveMediaPeriod;
    mediaContainerInfo: MediaContainerInfo;
    /**
     * @returns The default media if advertised,
     * or falls back on first media representation of the first set
     */
    getDefaultMedia(): AdaptiveMedia;
}
/**
 * A queriable collection of adaptive media sets. For example, each set might be an adaptation state.
 */
export declare class AdaptiveMediaPeriod {
    sets: AdaptiveMediaSet[];
    /**
     * @returns The default adaptive-media-set if advertised,
     * or falls back on first media representation of the first set
     */
    getDefaultSet(): AdaptiveMediaSet;
    getMediaListFromSet(index: number): AdaptiveMedia[];
    addSet(set: AdaptiveMediaSet): void;
    filterByContainedMediaTypes(mediaTypeFlags: MediaTypeSet, identical?: boolean): AdaptiveMediaSet[];
}
