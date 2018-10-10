import { Resource, ParseableResource } from './resource';
import { MpegIsoBmffBox } from './mpeg-isobmff-box';
import { MpegDashSidx } from './mpeg-dash-sidx';
export declare class MpegDashInitSegment extends Resource implements ParseableResource<MpegIsoBmffBox[]> {
    moov: MpegIsoBmffBox;
    sidx: MpegDashSidx;
    fetch(): Promise<Resource>;
    hasBeenParsed(): boolean;
    parse(): Promise<MpegIsoBmffBox[]>;
}
