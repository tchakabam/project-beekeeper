import { Resource, ParseableResource } from './resource';
import { ByteRange } from './byte-range';
import { AdaptiveMediaPeriod } from './adaptive-media';
import { XMLElement, XMLRootObject } from './xml-parser';
import { MpegDashInitSegment } from './mpeg-dash-init-segment';
export declare type MpegDashPeriod = {
    id: string;
    adaptationSets: MpegDashAdaptationSet[];
};
export declare type MpegDashSegment = {
    uri: string;
    range: ByteRange;
    duration: number;
};
export declare type MpegDashAdaptationSet = {
    id: string;
    par: string;
    contentType: string;
    lang: string;
    subsegmentAlignment: true;
    frameRate: string;
    audioSamplingRate: string;
    maxWidth: number;
    maxHeight: number;
    representations: MpegDashRepresentation[];
};
export declare type MpegDashRepresentation = {
    id: string;
    height: number;
    width: number;
    sar: string;
    codecs: string;
    bandwidth: number;
    mimeType: string;
    baseURL: string;
    indexRange: ByteRange;
    initializationRange: ByteRange;
    indexSegment: MpegDashInitSegment;
    initializationSegment: MpegDashInitSegment;
    segments: MpegDashSegment[];
};
export declare const parseMpdRootElement: (mpdObj: XMLRootObject) => XMLElement;
export declare const parsePeriods: (xmlParentElement: XMLElement, parentUrl: string) => MpegDashPeriod[];
export declare const parseAdaptationSets: (xmlParentElement: XMLElement, parentUrl: string) => MpegDashAdaptationSet[];
export declare const parseRepresentations: (xmlParentElement: XMLElement, parentUrl: string) => MpegDashRepresentation[];
export declare const parseSegments: (xmlParentElement: XMLElement, representation: MpegDashRepresentation, parentUrl: string) => void;
export declare const fetchInitializationSegments: (rep: MpegDashRepresentation) => Promise<Resource[]>;
export declare class MpegDashMpd extends Resource implements ParseableResource<AdaptiveMediaPeriod[]> {
    private _mpdObj;
    private _mpdRootEl;
    private _parsed;
    private _periods;
    mediaPresentationDuration: string;
    minBufferTime: string;
    profiles: string;
    type: string;
    periods: MpegDashPeriod[];
    constructor(uri: any);
    hasBeenParsed(): boolean;
    getSegments(): any;
    parse(): Promise<AdaptiveMediaPeriod[]>;
    fetch(): Promise<Resource>;
    private _forEachRepresentation;
    private _fetchAllIndexAndInitData;
    private _parseAllInitData;
    /**
     * Convert MPEG-DASH periods to generic data model
     */
    private _createPeriods;
}
