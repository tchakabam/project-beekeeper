import { EventEmitter } from 'eventemitter3';
import { ByteRange } from './byte-range';
import { ResourceRequestMaker, ResourceRequestResponseData } from './resource-request';
export declare enum ResourceEvents {
    BUFFER_SET = "buffer:set",
    BUFFER_CLEAR = "buffer:clear",
    FETCH_PROGRESS = "fetch:progress",
    FETCH_ABORTED = "fetch:aborted",
    FETCH_ERRORED = "fetch:errored",
    FETCH_SUCCEEDED = "fetch:succeeded",
    FETCH_SUCCEEDED_NOT = "fetch:succeeded-not"
}
export interface ParseableResource<ParsingResultType> extends Resource {
    hasBeenParsed(): boolean;
    parse(): Promise<ParsingResultType>;
}
export interface SegmentableResource<SegmentType> extends Resource {
    getSegments(): Promise<SegmentType[]>;
}
export interface DecryptableResource extends Resource {
    decrypt(): Promise<DecryptableResource>;
}
export declare class Resource extends EventEmitter {
    private uri_;
    private baseUri_;
    private byteRange_;
    private ab_;
    private abortedCnt_;
    private fetchAttemptCnt_;
    private requestMaker_;
    private request_;
    private requestResponseData_;
    private requestBytesLoaded_;
    private requestBytesTotal_;
    private mimeType_;
    private fetchLatency_;
    private fetchResolve_;
    private fetchReject_;
    /**
     *
     * @param uri may be relative or absolute
     * @param byteRange
     * @param baseUri
     * @param mimeType
     */
    constructor(uri: string, byteRange?: ByteRange, baseUri?: string, mimeType?: string);
    readonly uri: string;
    readonly baseUri: string;
    readonly byteRange: ByteRange;
    readonly mimeType: string;
    readonly hasBuffer: boolean;
    readonly hasRequestResponses: boolean;
    readonly hasData: boolean;
    readonly buffer: ArrayBuffer;
    readonly timesAborted: number;
    readonly timesFetchAttempted: number;
    readonly isFetching: boolean;
    readonly fetchLatency: number;
    readonly requestedBytesLoaded: number;
    readonly requestedBytesTotal: number;
    setBaseUri(baseUri: string): void;
    /**
     * Tries to resolve the resource's URI to an absolute URL,
     * with the given `baseUri` at construction or the optional argument
     * (which overrides the base of this instance for this resolution, but does not overwrite it).
     * Create a new resource object to do that.
     */
    getUrl(base?: string): string;
    setBuffer(ab: ArrayBuffer): void;
    clearBuffer(ab: any): void;
    fetch(): Promise<Resource>;
    abort(): void;
    /**
     *
     * @param rm passing null means use default
     */
    setRequestMaker(rm: ResourceRequestMaker | null): void;
    getRequestMaker(): ResourceRequestMaker;
    hasCustomRequestMaker(): boolean;
    getRequestResponses(): ResourceRequestResponseData[];
    flushAllRequestResponses(): void;
    getRequestResponse(pop?: boolean): ResourceRequestResponseData;
    setExternalyFetchedBytes(loaded: number, total: number, latency: number): void;
    private onRequestCallback_;
}
