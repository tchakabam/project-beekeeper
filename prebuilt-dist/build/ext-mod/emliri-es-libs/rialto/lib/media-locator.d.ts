import { ByteRange } from './byte-range';
export declare type MediaClockTime = number;
export declare class MediaLocator {
    readonly uri: string;
    readonly byteRange: ByteRange;
    readonly startTime: MediaClockTime;
    readonly endTime: MediaClockTime;
    static fromRelativeURI(relativeUri: string, baseUri?: string, byteRange?: ByteRange, startTime?: MediaClockTime, endTime?: MediaClockTime): MediaLocator;
    constructor(uri: string, byteRange: ByteRange, startTime: MediaClockTime, endTime: MediaClockTime);
}
