/**
 * @author Stephan Hesse <disparat@gmail.com>
 * @module xhr An improvement over the standard XMLHttpRequest API (and with type-safety :)
 *
 * For usage in a Node.js base env (like ts-node) @see https://www.npmjs.com/package/node-http-xhr
 *
 */
import { ByteRange } from './byte-range';
import { IResourceRequest } from './resource-request';
export declare type XHRHeader = [string, string];
export declare type XHRHeaders = XHRHeader[];
export declare type XHRData = ArrayBuffer | Blob | Document | string | FormData | null;
export declare enum XHRMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD"
}
export declare enum XHRResponseType {
    VOID = "",
    ARRAY_BUFFER = "arraybuffer",
    BLOB = "blob",
    DOCUMENT = "document",
    JSON = "json",
    TEXT = "text"
}
export declare enum XHRState {
    UNSENT,
    OPENED,
    HEADERS_RECEIVED,
    LOADING,
    DONE
}
export declare enum XHRStatusCategory {
    VOID = "void",
    INFO = "info",
    SUCCESS = "success",
    REDIRECT = "redirect",
    REQUEST_ERROR = "request_error",
    SERVER_ERROR = "server_error",
    CUSTOME_SERVER_ERROR = "custom_server_error"
}
export declare type XHRCallbackFunction = (xhr: XHR, isProgressUpdate: boolean) => void;
/**
 *
 * Thin wrapper to keep state of one XHR.
 *
 * This class allows to perform requests, deal with their outcome and intermediate states.
 *
 * Requests are being sent out directly on construction (there is no state in between creating and sending a request).
 *
 * Any state change is signaled via the one callback function passed on construction.
 *
 * Request `xhrState` and HTTP `status` can be read via the respective instance properties.
 *
 * Check the values from within your callback.
 *
 * Same goes for response headers and body data, or eventual errors or abortion flags.
 *
 * The object is not recycleable (lives only for one single request, does not care about retrying and such).
 *
 * @class
 * @constructor
 */
export declare class XHR implements IResourceRequest {
    private _xhrCallback;
    private _xhr;
    private _responseHeadersMap;
    private _error;
    private _state;
    private _aborted;
    private _loadedBytes;
    private _totalBytes;
    private _progressUpdatesEnabled;
    private _createdAt;
    private _timeUntilHeaders;
    private _timeUntilLoading;
    private _timeUntilDone;
    /**
     * Enables "Content-Range" request header from given `ByteRange` object in constructor
     */
    enableContentRange: boolean;
    encodeStringsToUtf8Buffer: boolean;
    constructor(url: string, xhrCallback?: XHRCallbackFunction, method?: XHRMethod, responseType?: XHRResponseType, byteRange?: ByteRange, headers?: XHRHeaders, data?: XHRData, withCredentials?: boolean, timeout?: number, forceXMLMimeType?: boolean);
    setProgressUpdatesEnabled(enabled: boolean): void;
    readonly isInfo: boolean;
    /**
     * @returns {boolean} Returns `true` when request status code is in range [200-299] (success)
     */
    readonly isSuccess: boolean;
    /**
     * @returns {boolean} Returns `true` when request status code is signaling redirection
     */
    readonly isRedirect: boolean;
    readonly isRequestError: boolean;
    readonly isServerError: boolean;
    readonly isCustomServerError: boolean;
    readonly isContentRange: boolean;
    readonly isVoidStatus: boolean;
    getStatusCategory(): XHRStatusCategory;
    readonly error: Error;
    /**
     * Native Upload object
     * @readonly
     */
    readonly upload: XMLHttpRequestUpload;
    /**
     * Native XHR object
     * @readonly
     */
    readonly xhr: XMLHttpRequest;
    readonly xhrState: XHRState;
    readonly status: number;
    readonly statusText: string;
    readonly responseHeaders: object;
    readonly responseType: XHRResponseType;
    readonly responseData: XHRData;
    readonly responseText: string;
    readonly responseDocument: Document;
    readonly responseURL: string;
    readonly hasBeenAborted: boolean;
    readonly hasErrored: boolean;
    readonly loadedBytes: number;
    readonly totalBytes: number;
    readonly secondsUntilHeaders: number;
    readonly secondsUntilLoading: number;
    readonly secondsUntilDone: number;
    /**
     * @returns {number}
     */
    readonly loadedFraction: number;
    getSecondsSinceCreated(): number;
    abort(): void;
    wasSuccessful(): boolean;
    private onReadyStateChange;
    private onError;
    private onAbort;
    private onProgress;
}
