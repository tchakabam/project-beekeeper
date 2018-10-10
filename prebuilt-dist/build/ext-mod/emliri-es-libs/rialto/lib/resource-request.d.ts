import { XHRMethod, XHRResponseType, XHRHeaders, XHRData, XHRState } from "./xhr";
import { ByteRange } from "./byte-range";
import { Resource } from "./resource";
export interface IResourceRequest {
    abort(): any;
    wasSuccessful(): boolean;
    readonly xhrState: XHRState;
    readonly responseType: XHRResponseType;
    readonly responseData: XHRData;
    readonly responseHeaders: object;
    readonly loadedBytes: number;
    readonly totalBytes: number;
    readonly hasBeenAborted: boolean;
    readonly hasErrored: boolean;
    readonly error: Error;
    readonly secondsUntilLoading: number;
    readonly secondsUntilDone: number;
    readonly secondsUntilHeaders: number;
}
export declare class ResourceRequestResponseData {
    readonly request: IResourceRequest;
    readonly resource: Resource;
    constructor(request: IResourceRequest, resource: Resource);
    isBinary(): boolean;
    isChars(): boolean;
    getArrayBuffer(): ArrayBuffer;
    getString(unicode16?: boolean): string;
}
export declare type ResourceRequestCallback = (req: IResourceRequest, isProgressUpdate: boolean) => void;
export declare type ResourceRequestOptions = Partial<{
    requestCallback: ResourceRequestCallback;
    method: XHRMethod;
    responseType: XHRResponseType;
    byteRange: ByteRange;
    headers: XHRHeaders;
    data: XHRData;
    withCredentials: boolean;
    timeout: number;
    forceXMLMimeType: boolean;
}>;
export declare type ResourceRequestMaker = (url: string, opts: ResourceRequestOptions) => IResourceRequest;
export declare const makeDefaultRequest: ResourceRequestMaker;
