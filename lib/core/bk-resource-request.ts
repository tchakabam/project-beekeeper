import * as Debug from 'debug';

import { IResourceRequest, ResourceRequestOptions, ResourceRequestCallback } from '../../ext-mod/emliri-es-libs/rialto/lib/resource-request';
import { XHRState, XHRData, XHR, XHRResponseType } from '../../ext-mod/emliri-es-libs/rialto/lib/xhr';
import { getPerfNow } from '../core/perf-now';
import { BKResource, BK_IProxy, BKProxyEvents } from '../core';

const debug = Debug('bk:engine:universal:resource-request');

export class BKResourceRequest implements IResourceRequest {

    xhrState: XHRState = XHRState.UNSENT;

    responseData: XHRData = null;
    responseHeaders: object = {};
    responseType: XHRResponseType;

    loadedBytes: number = 0;
    totalBytes: number = NaN;

    hasBeenAborted: boolean = false;
    hasErrored: boolean = false;

    error: Error = null;

    secondsUntilLoading: number = NaN;
    secondsUntilDone: number = NaN;
    secondsUntilHeaders: number = NaN;

    private _resource: BKResource;

    private _resourceRequestCallback: ResourceRequestCallback;
    private _wasSuccessful: boolean = false;
    private _requestCreated: number = null;

    constructor(
        private proxy: BK_IProxy,
        private swarmId: string,
        private url: string,
        private options: ResourceRequestOptions = {}
    ) {
        debug(`new p2p media downloader request for ${url}`);

        this.proxy.on(BKProxyEvents.ResourceLoaded, this.onResourceLoaded.bind(this));
        this.proxy.on(BKProxyEvents.ResourceError, this.onResourceError.bind(this));
        this.proxy.on(BKProxyEvents.ResourceAbort, this.onResourceAbort.bind(this));

        debug(`creating new p2p resource: ${url} with swarm-ID "${swarmId}"`);

        const res: BKResource = this._resource = new BKResource(
            url,
            this.options.byteRange
        );

        res.swarmId = this.swarmId;

        this.proxy.enqueue(res);

        this._resourceRequestCallback = this.options.requestCallback;
        this._requestCreated = getPerfNow();

        this.responseType = XHRResponseType.ARRAY_BUFFER;
    }

    abort() {
        this.hasBeenAborted = true;
    }

    wasSuccessful(): boolean  {
        return this._wasSuccessful;
    }

    getResource(): BKResource {
        return this._resource;
    }

    private _invokeRequestCallback() {
        if (this._resourceRequestCallback) {
            debug('invoke resource request callback');
            this._resourceRequestCallback(this, false);
        }
    }

    private onResourceLoaded(res: BKResource) {
        if (res.id !== this._resource.id) {
            return;
        }

        if (this.hasBeenAborted) {
            return;
        }

        this._wasSuccessful = true;

        this.xhrState = XHRState.DONE;

        this.secondsUntilHeaders = 0;
        this.secondsUntilDone = (getPerfNow() - this._requestCreated) / 1000;

        this.secondsUntilLoading = this.secondsUntilDone;

        this.loadedBytes = res.data.byteLength;
        this.totalBytes = res.data.byteLength;
        this.responseData = res.data;

        debug(`segment loaded: ${this.url}`, res.getUrl());

        this._invokeRequestCallback();
    }

    private onResourceError(segment: BKResource, err: Error) {
        if (segment.id !== this._resource.id) {
            return;
        }

        if (this.hasBeenAborted) {
            return;
        }

        debug(`segment error: ${this.url}`);
    }

    private onResourceAbort(segment: BKResource) {
        if (segment.id !== this._resource.id) {
            return;
        }

        if (this.hasBeenAborted) {
            return;
        }

        debug(`segment aborted: ${this.url}`);

        this.hasBeenAborted = true;
    }
}
