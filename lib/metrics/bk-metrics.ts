import * as Debug from 'debug';

import { XHR, XHRMethod, XHRResponseType } from "../../ext-mod/emliri-es-libs/rialto/lib/xhr";
import { BK_IProxy, BKAccessProxyEvents, BKResource } from '../core';
import { BKPeer } from '../core/peer';
import { BKResourceStatus } from '../core/bk-resource';

const debug = Debug('bk:metrics');

export enum BKMetricsType {
    CDN_DOWNLOAD_DONE = 'cdn-download-done',
    CDN_DOWNLOAD_ERROR = 'cdn-download-error',
    PEER_DOWNLOAD_DONE = 'peer-download-done',
    PEER_DOWNLOAD_ERROR = 'peer-download-error',
    PEER_UPLOAD_DONE = 'peer-upload-done',
    PEER_UPLOAD_ERROR = 'peer-upload-error',
    VIDEO_START_TIME = 'video-start-time',
    VIDEO_BUFFER_UNDERRUN = 'video-buffer-underrun',
    VIDEO_BUFFER_FULL = 'video-buffer-full',
    SESSION_DATA = 'session-data'
}

export type BKMetricsPeerData = {
    remotePeerId: string
    resourceId: string
}

export type BKMetricsCDNData = {
    remoteHost: string
    resourceId: string
}

export type BKMetricsVideoData = {
    eventLatencyMs: number
}

export type BKMetricsSessionData = {
    p2pDownloadRatio: number,
    p2pUploadRatio: number,
    cdnDownloadedBytes: number,
    peerDownloadedBytes: number,
    peerUploadedBytes: number
}

export type BK_IMetricsData = BKMetricsSessionData | BKMetricsPeerData | BKMetricsCDNData;

export type BKMetricsProps = {
    sessionId: string
    peerId: string
    contentUrl: string
    timestamp: number
    type: BKMetricsType
    data?: BK_IMetricsData
}

export type BKMetricsEvent = {
    event: BKMetricsType
    nonce: string
    props: BKMetricsProps
}

export interface BKMetricsQueue {
    push(event: BKMetricsEvent);
    pop(): BKMetricsEvent
    needsConsumer(): boolean;
}

export class BKMetricsRecorder implements BKMetricsQueue {
    private _storedEvents: BKMetricsEvent[] = [];

    constructor(
        public peerId: string,
        public contentUrl: string) {
    }

    capture(type: BKMetricsType, data: BK_IMetricsData): BKMetricsEvent {
        const {peerId, contentUrl} = this;

        return {
            event: type,
            nonce: peerId,
            props: {
                sessionId: peerId,
                peerId,
                contentUrl,
                timestamp: Date.now(),
                type: type,
                data
            }
        };
    }

    record(event: BKMetricsEvent) {
        this._storedEvents.push(event);
    }

    pop(): BKMetricsEvent {
        return this._storedEvents.shift();
    }

    push(event: BKMetricsEvent) {
        this._storedEvents.unshift(event);
    }

    needsConsumer(): boolean {
        return this._storedEvents.length > 0;
    }
}

export class BKMetricsConsumer {

    private _interval: number = null;

    constructor(
        public endpointUrl: string,
        public store: BKMetricsQueue,
        public intervalMs: number = 1000) {}

    start() {
        if (this._interval !== null) {
            throw new Error('Already started consuming metrics');
        }
        this._interval = window.setInterval(() => this._consume(), this.intervalMs);
    }

    stop() {
        if (this._interval === null) {
            throw new Error('Already stopped consuming metrics');
        }
        window.clearInterval(this._interval);
        this._interval = null;
    }

    private _consume() {
        if (!this.store.needsConsumer()) {
            return;
        }

        const event = this.store.pop();
        if (!event) {
            throw new Error('Pop should have returned metrics event');
        }

        const xhrCallback = (xhr: XHR, isProgressUpdate: boolean) => {
            if (xhr.isSuccess) {
                debug('done sending metrics data');
                this._consume();
            } else if (xhr.isRequestError || xhr.isServerError) {
                debug('error sending metrics data, re-enqueuing');
                this.store.push(event);
                this._consume();
            }
        }

        const xhr: XHR = new XHR(
            this.endpointUrl,
            xhrCallback,
            XHRMethod.POST,
            XHRResponseType.TEXT,
            null,
            null,
            JSON.stringify(event, null, 2)
        );

        //window.setTimeout(() => this._consume(), 0);
    }
}

export class BKProxyMetricsConsumer extends BKMetricsConsumer {
    constructor(private _proxy: BK_IProxy, contentUrl: string, metricsEndpointUrl: string) {
        super(metricsEndpointUrl, new BKMetricsRecorder(_proxy.getPeerId(), contentUrl));

        /*
        _proxy.on(BKAccessProxyEvents.ResourceEnqueuedHttp, (res: BKResource) => {

        });

        _proxy.on(BKAccessProxyEvents.ResourceEnqueuedP2p, (res: BKResource) => {

        });
        */

        _proxy.on(BKAccessProxyEvents.ResourceFetched, (res: BKResource) => {

            switch(res.status) {
            case BKResourceStatus.LoadingViaP2p:
                break;
            case BKResourceStatus.LoadingViaHttp:
                break;
            case BKResourceStatus.Void
            }

        });

        _proxy.on(BKAccessProxyEvents.ResourceError, (res: BKResource) => {

        })

        _proxy.on(BKAccessProxyEvents.PeerResponseSent, (res: BKResource, peer: BKPeer) => {

        });
    }
}
