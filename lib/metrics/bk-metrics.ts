import * as Debug from 'debug';

import { XHR, XHRMethod, XHRResponseType } from "../../ext-mod/emliri-es-libs/rialto/lib/xhr";
import { BK_IProxy, BKAccessProxyEvents, BKResource } from '../core';
import { BKPeer } from '../core/peer';
import { BKResourceStatus, BKResourceTransportMode } from '../core/bk-resource';

const debug = Debug('bk:metrics');

export enum BKMetricsEventType {
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

export type BKMetricsTransmissionData = {
    downloadRateKbps: number
    uploadRateKbps: number
    numBytes: number
}

export type BKMetricsPeerData = {
    remotePeerId: string
    resourceId: string
} & BKMetricsTransmissionData;

export type BKMetricsCDNData = {
    remoteHost: string
    resourceId: string
} & BKMetricsTransmissionData;

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
    type: BKMetricsEventType
    data?: BK_IMetricsData
}

export type BKMetricsEvent = {
    event: BKMetricsEventType
    nonce: string
    properties: BKMetricsProps
}

export class BKMetricsRecorder {
    private _storedEvents: BKMetricsEvent[] = [];

    constructor(
        public peerId: string,
        public contentUrl: string) {
    }

    capture(type: BKMetricsEventType, data: BK_IMetricsData) {
        const {peerId, contentUrl} = this;
        const event = {
            event: type,
            nonce: peerId,
            properties: {
                sessionId: peerId,
                peerId,
                contentUrl,
                timestamp: Date.now(),
                type: type,
                data
            }
        };
        this._storedEvents.push(event);
    }

    /**
     * pops an event off the stack
     */
    pop(): BKMetricsEvent {
        return this._storedEvents.shift();
    }

    /**
     * puts an event back on top of the stack
     * @param event
     */
    push(event: BKMetricsEvent) {
        this._storedEvents.unshift(event);
    }

    shouldBeConsumed(): boolean {
        return this._storedEvents.length > 0;
    }
}

export class BKMetricsConsumer {

    private _interval: number = null;

    constructor(
        public endpointUrl: string,
        public recorder: BKMetricsRecorder,
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
        if (!this.recorder.shouldBeConsumed()) {
            return;
        }

        const event = this.recorder.pop();
        if (!event) {
            throw new Error('Recorder should have returned metrics event');
        }

        const xhrCallback = (xhr: XHR, isProgressUpdate: boolean) => {


            if (xhr.isSuccess) {
                debug('done sending metrics data');
                this._consume();
            } else if (xhr.hasErrored || xhr.isRequestError || xhr.isServerError) {
                debug('request has errored:', xhr.error.message, 'with status:', xhr.status);
                debug('error sending metrics data, re-enqueuing');

                this.recorder.push(event);

                this.stop();
                //this._consume();
            }
        }

        const xhr: XHR = new XHR(
            this.endpointUrl,
            xhrCallback,
            XHRMethod.POST,
            XHRResponseType.JSON,
            null,
            [["Content-Type", "application/json;charset=UTF-8"]],
            JSON.stringify(event, null, 2)
        );

        //window.setTimeout(() => this._consume(), 0);
    }
}

export class BKProxyMetricsConsumer extends BKMetricsConsumer {

    constructor(private _proxy: BK_IProxy, contentUrl: string, metricsEndpointUrl: string) {

        super(metricsEndpointUrl, new BKMetricsRecorder(_proxy.getPeerId(), contentUrl));

        _proxy.on(BKAccessProxyEvents.ResourceFetched, (res: BKResource) => {

            let eventType: BKMetricsEventType;
            let data;

            switch(res.transportMode) {
            case BKResourceTransportMode.UNKNOWN:
                throw new Error('Resource should not have unknown transport mode');
            case BKResourceTransportMode.P2P:
                let p2pData: BKMetricsPeerData = {
                    remotePeerId: null,
                    resourceId: res.uri,
                    uploadRateKbps: 0,
                    downloadRateKbps: res.getRecordedTransmissionRateBps() / 1000,
                    numBytes: res.requestedBytesLoaded
                }
                eventType = BKMetricsEventType.PEER_DOWNLOAD_DONE;
                data = p2pData;
                break;
            case BKResourceTransportMode.HTTP:
                let cdnData: BKMetricsCDNData = {
                    remoteHost: res.getUrl(),
                    resourceId: res.uri,
                    uploadRateKbps: 0,
                    downloadRateKbps: res.getRecordedTransmissionRateBps() / 1000,
                    numBytes: res.requestedBytesLoaded,
                }
                eventType = BKMetricsEventType.CDN_DOWNLOAD_DONE;
                data = cdnData;
                break;
            }

            this.recorder.capture(eventType, data);
        });

        _proxy.on(BKAccessProxyEvents.ResourceError, (res: BKResource) => {



        })

        _proxy.on(BKAccessProxyEvents.PeerResponseSent, (res: BKResource, peer: BKPeer) => {

        });
    }
}
