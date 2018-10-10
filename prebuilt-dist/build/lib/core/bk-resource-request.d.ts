import { IResourceRequest, ResourceRequestOptions } from '../../ext-mod/emliri-es-libs/rialto/lib/resource-request';
import { XHRState, XHRData, XHRResponseType } from '../../ext-mod/emliri-es-libs/rialto/lib/xhr';
import { BKResource, BK_IProxy } from '../core';
export declare class BKResourceRequest implements IResourceRequest {
    private proxy;
    private swarmId;
    private url;
    private options;
    xhrState: XHRState;
    responseData: XHRData;
    responseHeaders: object;
    responseType: XHRResponseType;
    loadedBytes: number;
    totalBytes: number;
    hasBeenAborted: boolean;
    hasErrored: boolean;
    error: Error;
    secondsUntilLoading: number;
    secondsUntilDone: number;
    secondsUntilHeaders: number;
    private _resource;
    private _resourceRequestCallback;
    private _wasSuccessful;
    private _requestCreated;
    constructor(proxy: BK_IProxy, swarmId: string, url: string, options?: ResourceRequestOptions);
    abort(): void;
    wasSuccessful(): boolean;
    getResource(): BKResource;
    private _invokeRequestCallback;
    private onResourceLoaded;
    private onResourceError;
    private onResourceAbort;
}
