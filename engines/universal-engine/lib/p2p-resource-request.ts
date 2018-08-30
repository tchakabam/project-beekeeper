import * as Debug from "debug";

import { IResourceRequest, ResourceRequestOptions, ResourceRequestCallback } from "../../../ext-mod/emliri-es-libs/rialto/lib/resource-request";
import { XHRState, XHRData, XHR } from "../../../ext-mod/emliri-es-libs/rialto/lib/xhr";
import { BKResource, BK_IProxy, Events } from "../../../core/lib";

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

    private segment: BKResource;

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

        const segment: BKResource = this.segment = new BKResource(
            url,
            this.options.byteRange
        );

        this.downloader.load([segment], this.swarmId);

        this._resourceRequestCallback = this.options.requestCallback;
        this._requestCreated = Date.now();
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

    private onSegmentLoaded(segment: BKResource) {
        if (segment.id !== this.segment.id) {
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

        this.loadedBytes = segment.data.byteLength;
        this.totalBytes = segment.data.byteLength;
        this.responseData = segment.data;

        debug(`segment loaded: ${this.url}`, segment);

        this._invokeRequestCallback();
    }

    private onSegmentError(segment: BKResource, err: Error) {
        if (segment.id !== this.segment.id) {
            return;
        }

        if (this.hasBeenAborted) {
            return;
        }

        debug(`segment error: ${this.url}`)
    }

    private onSegmentAbort(segment: BKResource) {
        if (segment.id !== this.segment.id) {
            return;
        }

        if (this.hasBeenAborted) {
            return;
        }

        debug(`segment aborted: ${this.url}`)

        this.hasBeenAborted = true;
    }
}
