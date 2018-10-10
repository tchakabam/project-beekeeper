import { MpegIsoBmffBox } from './mpeg-isobmff-box';
/**
 * @param data Iso-ff binary data
 * @param parsedSidx An existing box object instance to parse data into
 * @returns {MpegDashSidx} A new or the passed object
 */
export declare const parseSidxData: (data: Uint8Array, parsedSidx: MpegDashSidx) => MpegDashSidx;
export declare type MpegDashSidxReference = {
    referenceSize: number;
    subsegmentDuration: number;
    info: {
        duration: number;
        start: number;
        end: number;
    };
};
export declare class MpegDashSidx extends MpegIsoBmffBox {
    earliestPresentationTime: number;
    timescale: number;
    version: number;
    referencesCount: number;
    references: MpegDashSidxReference[];
    constructor(box: MpegIsoBmffBox);
}
