import * as Debug from "debug";

import { IResourceRequest, ResourceRequestOptions, ResourceRequestCallback } from "../../../ext-mod/emliri-es-libs/rialto/lib/resource-request";
import { XHRState, XHRData, XHR } from "../../../ext-mod/emliri-es-libs/rialto/lib/xhr";
import { BKResource, BK_IProxy, Events } from "../../../core/lib";
import { getPerfNow } from "../../../core/lib/perf-now";

const debug = Debug("p2pml:universal:resource-request");

export class P2PMediaDownloaderRequest implements IResourceRequest {

    xhrState: XHRState = XHRState.UNSENT;
    responseData: XHRData = null;
    responseHeaders: object = {};
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
        private downloader: BK_IProxy,
        private swarmId: string,
        private url: string,
        private options: ResourceRequestOptions = {}
    ) {
        debug(`new p2p media downloader request for ${url}`);

        this.downloader.on(Events.SegmentLoaded, this.onSegmentLoaded.bind(this));
        this.downloader.on(Events.SegmentError, this.onSegmentError.bind(this));
        this.downloader.on(Events.SegmentAbort, this.onSegmentAbort.bind(this));

        debug(`creating new p2p resource: ${url} with swarm-ID "${swarmId}"`);

        const res: BKResource = this._resource = new BKResource(
            url,
            this.options.byteRange
        );

        res.swarmId = this.swarmId;

        this.downloader.enqueue(res);

        this._resourceRequestCallback = this.options.requestCallback;
        this._requestCreated = getPerfNow();
    }

    abort() {
        this.hasBeenAborted = true;
    }

    wasSuccessful(): boolean  {
        return this._wasSuccessful;
    }

    private _invokeRequestCallback() {
        if (this._resourceRequestCallback) {
            debug("invoke resource request callback")
            this._resourceRequestCallback(this, false);
        }
    }

    private onSegmentLoaded(res: BKResource) {
        if (res.id !== this._resource.id) {
            return;
        }

        if (this.hasBeenAborted) {
            return;
        }

        this._wasSuccessful = true;

        this.xhrState = XHRState.DONE;

        this.secondsUntilHeaders = 0;
        this.secondsUntilDone = Date.now() - this._requestCreated;
        this.secondsUntilLoading = this.secondsUntilDone;

        this.loadedBytes = res.data.byteLength;
        this.totalBytes = res.data.byteLength;
        this.responseData = res.data;

        debug(`segment loaded: ${this.url}`, res);

        this._invokeRequestCallback();
    }

    private onSegmentError(segment: BKResource, err: Error) {
        if (segment.id !== this._resource.id) {
            return;
        }

        if (this.hasBeenAborted) {
            return;
        }

        debug(`segment error: ${this.url}`)
    }

    private onSegmentAbort(segment: BKResource) {
        if (segment.id !== this._resource.id) {
            return;
        }

        if (this.hasBeenAborted) {
            return;
        }

        debug(`segment aborted: ${this.url}`)

        this.hasBeenAborted = true;
    }
}
