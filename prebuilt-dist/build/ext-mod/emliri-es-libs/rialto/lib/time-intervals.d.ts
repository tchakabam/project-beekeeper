/**
 * @author Stephan Hesse (c) Copyright 2018 <stephan@emliri.com>
 *
 */
/**
 * @module time-intervals Allows to deal with time-intervals/ranges and perform all sorts of operations on them
 * including merging/concat, flattening, aggregation/duration/window-sum and comparison of all sorts.
 *
 * Can also digest native TimeRanges objects.
 */
export declare type TimeIntervalProperties = {
    seekable: boolean;
    desired: boolean;
    fetched: boolean;
};
export declare class TimeInterval {
    readonly start: number;
    readonly end: number;
    private _props;
    constructor(start: number, end: number);
    readonly props: TimeIntervalProperties;
    /**
     * @returns must be > 0
     */
    readonly duration: number;
    /**
     *
     * @param range
     * @returns positive if `range` starts after this starts
     */
    compareStart(range: TimeInterval): number;
    /**
     *
     * @param range
     * @returns positive if `range` ends after this ends
     */
    compareEnd(range: TimeInterval): number;
    /**
     *
     * @param time a value to compare this interval with
     * @param strict when true, uses strict comparison (boundaries not part of interval)
     * @returns true when time values lies within interval
     */
    compareInterval(time: number, strict?: boolean): boolean;
    /**
     *
     * @param range
     * @returns true when `range` is fully inside this
     */
    contains(range: TimeInterval): boolean;
    /**
     *
     * @param range
     * @returns true when `range` interval is equal to this
     */
    equals(range: TimeInterval): boolean;
    /**
     *
     * @param range
     * @returns true when ranges overlap somehow
     */
    overlapsWith(range: TimeInterval): boolean;
    /**
     *
     * @param range
     * @returns true when `range` and this are continuous in their interval values
     */
    touchesWith(range: TimeInterval): boolean;
    /**
     *
     * @param range
     * @returns true when this is continued by `range`
     * See `touchesWith` but implies order, when this comes after `range`.
     */
    continues(range: TimeInterval): boolean;
    /**
     *
     * @param range
     * @returns a new range object that represents the overlapping range region (if any) or `null`
     */
    getOverlappingRange(range: TimeInterval): TimeInterval | null;
    /**
     *
     * @param range
     * @returns a new range object that represents the merge of two ranges (that must overlap)
     */
    getMergedRange(range: TimeInterval): TimeInterval | null;
    getGapRange(range: TimeInterval): TimeInterval | null;
    /**
     *
     * @param range
     * @returns candidates for start/end points of overlapping ranges (when start > end then they don't overlap)
     */
    private _getOverlapRangeBoundaries;
}
export declare class TimeIntervalContainer {
    private _ranges;
    private _isFlat;
    static fromTimeRanges(ranges: TimeRanges): void;
    constructor(_ranges?: TimeInterval[], _isFlat?: boolean);
    readonly ranges: TimeInterval[];
    readonly size: number;
    add(range: TimeInterval): TimeIntervalContainer;
    clear(): TimeIntervalContainer;
    /**
     * Flattens the time-ranges so that if they overlap or touch they get merged into one.
     * This can be used to avoid when we add overlapping time-ranges that the container elements number
     * grows while keeping the same necessary information for most use-cases.
     * @returns a flattened version of the time-intervals in this container
     */
    flatten(inPlace?: boolean): TimeIntervalContainer;
    sort(inPlace?: boolean): TimeIntervalContainer;
    /**
     * Cross-checks every range in this container with the ranges in other containers for overlaps.
     * Early-returns as soon as the first overlap is found.
     * @param ranges
     * @returns true if any range from this overlaps with a range from that
     */
    hasOverlappingRangesWith(ranges: TimeIntervalContainer): boolean;
    /**
     * Checks one value against all intervals in this
     * @param value
     */
    hasIntervalsWith(value: number): boolean;
    getEarliestRange(): TimeInterval;
    /**
     * @returns duration as sum of all interval durations. will be equal to window duration
     * if the media is gapless and has no time-plane discontinuities.
     */
    getCumulatedDuration(): number;
    /**
     * @returns duration as difference between last interval end and first interval start
     */
    getWindowDuration(): number;
    toTimeRanges(): TimeRanges;
    /**
     * For compatibility with HTML5 native TimeRanges object,
     * converts them internally to TimeInterval for each element in TimeRanges container.
     * @param ranges HTML5 TimeRanges object
     */
    addTimeRanges(ranges: TimeRanges): void;
}
