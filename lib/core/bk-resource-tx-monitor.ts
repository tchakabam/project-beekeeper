import { BKResourceRequest } from '../core/bk-resource-request';
import { ResourceEvents } from '../../ext-mod/emliri-es-libs/rialto/lib/resource';
import { BKResource } from '../core';
import { BKAccessProxyEvents, BK_IProxy } from '../core/bk-access-proxy';
import { Peer } from './peer';

const html = require('html-tag');
const domify = require('domify');

abstract class BKResourceTransferView {
    constructor(
        protected _resource: BKResource
    ) {}

    readonly isUpload: boolean = false;
    readonly isP2P: boolean = false;

    getTxBytes(): number {
        return this._resource.requestedBytesLoaded;
    }

    abstract getHTML(): string;
}

class BKResourceUploadView extends BKResourceTransferView {

    readonly isUpload: boolean = true;
    readonly isP2P: boolean = true;

    constructor(
        _resource: BKResource,
        private _peer: Peer,
        private _monitor: BKResourceTransferMonitorDomView
    ) {
        super(_resource);
    }

    getHTML(): string {
        const loaded = this._resource.requestedBytesLoaded;
        const total = this._resource.requestedBytesTotal;
        const txKbps = (8 * this._resource.requestedBytesLoaded
                        / this._resource.fetchLatency) / 1000;

        //console.log('fetch-latency', this._resource.fetchLatency);

        return `<div class="resource-ul">Direction: UPLOAD<br><span><label>URL:</label> ${this._resource.getUrl()}</span><br>
            | <span><label>Peer</label>: ${ this._peer.id } / ${this._peer.remoteAddress}</span>
            | <span>${ true ? 'P2P' : 'HTTP' }</span>
            | <span><label>Transferred (bytes):</label> ${loaded} / ${total}</span></div>`;
    }
}

class BKResourceDownloadView extends BKResourceTransferView {

    readonly isUpload: boolean = false;
    readonly isP2P: boolean = false;

    constructor(
        resource: BKResource,
        private _isP2p: boolean,
        private _monitor: BKResourceTransferMonitorDomView
    ) {

        super(resource);

        this.isP2P = _isP2p;

        this._resource.on(ResourceEvents.FETCH_PROGRESS, () => {
            this._onFetchProgress();
        });

        this._resource.on(ResourceEvents.FETCH_SUCCEEDED, () => {
            this._onFetchSucceeded();
        });

        this._resource.on(ResourceEvents.BUFFER_SET, () => {
            this._onFetchSucceeded();
        });

        this._resource.on(ResourceEvents.FETCH_ABORTED, () => {
            this._onFetchAborted();
        });

        this._resource.on(ResourceEvents.FETCH_ERRORED, () => {
            this._onFetchErrored();
        });
    }

    getHTML(): string {

        const loaded = this._resource.requestedBytesLoaded;
        const total = this._resource.requestedBytesTotal;
        const txKbps = (8 * this._resource.requestedBytesLoaded
                        / this._resource.fetchLatency) / 1000;

        //console.log('fetch-latency', this._resource.fetchLatency);

        return `<div class="resource-dl">
                Direction: DOWNLOAD<br>
                <span><label>URL:</label> ${this._resource.getUrl()}</span><br>
                | <span>${ this._isP2p ? 'P2P' : 'HTTP' }</span>
                | <span><label>Transferred (bytes):</label> ${loaded} / ${total}</span>
                | <span><label>Bitrate (kbits/sec): </label> ${txKbps.toFixed(1)}</span></div>`;
    }

    private _onFetchProgress() {
        this._monitor.update();
    }

    private _onFetchSucceeded() {
        this._monitor.update();
    }

    private _onFetchErrored() {}

    private _onFetchAborted() {}
}

export class BKResourceTransferMonitorDomView {

    private _resourceTransfers: BKResourceTransferView[] = [];
    private _domRootEl: HTMLElement;

    constructor(
        private _proxy: BK_IProxy,
        domRootId: string,
    ) {
        this._proxy.on(BKAccessProxyEvents.ResourceEnqueuedHttp, (res: BKResource) => {
            this.addResourceDownload(res, false);
        });

        this._proxy.on(BKAccessProxyEvents.ResourceEnqueuedP2p, (res: BKResource) => {
            this.addResourceDownload(res, true);
        });

        this._proxy.on(BKAccessProxyEvents.PeerResponseSent, (res: BKResource, peer: Peer) => {
            this.addResourceUpload(res, peer);
        });

        this._domRootEl = document.getElementById(domRootId);
        if (!this._domRootEl) {
            throw new Error(`No root element found with id "${domRootId}"`);
        }
    }

    addResourceDownload(res: BKResource, isP2p: boolean) {
        this._resourceTransfers.push(new BKResourceDownloadView(res, isP2p, this));
        this.update();
    }

    addResourceUpload(res: BKResource, peer: Peer) {
        this._resourceTransfers.push(new BKResourceUploadView(res, peer, this));
        this.update();
    }

    getOverallStats(): {
        p2pDownloadRatio: number,
        p2pUploadRatio: number,
        cdnDownloadedBytes: number,
        peerDownloadedBytes: number,
        peerUploadedBytes: number
    } {
        let cdnDownloadedBytes = 0;
        let peerDownloadedBytes = 0;
        let peerUploadedBytes = 0;
        let p2pDownloadRatio = 0;
        let p2pUploadRatio = 0;

        this._resourceTransfers.forEach((resourceTx: BKResourceTransferView) => {
            if (resourceTx.isUpload) {
                peerUploadedBytes += resourceTx.getTxBytes()
            } else {
                if (resourceTx.isP2P) {
                    peerDownloadedBytes += resourceTx.getTxBytes();
                } else {
                    cdnDownloadedBytes += resourceTx.getTxBytes();
                }
            }
        });

        p2pDownloadRatio = Math.round(100 * peerDownloadedBytes / (cdnDownloadedBytes + peerDownloadedBytes)) / 100;
        p2pUploadRatio = Math.round(100 * peerUploadedBytes / (cdnDownloadedBytes + peerDownloadedBytes)) / 100;

        return {
            p2pDownloadRatio,
            p2pUploadRatio,
            cdnDownloadedBytes,
            peerDownloadedBytes,
            peerUploadedBytes
        }
    }

    update() {
        // use JSX / React
        const stats = this.getOverallStats();
        let html = '';
        html += `<div>
            <label>Overall stats:</label><p><pre>${ JSON.stringify(stats, null, 2)  }</pre></p>
        </div>`;
        html += '<div>';
        this._resourceTransfers.forEach((resourceTransfer: BKResourceDownloadView) => {
            html += `<div class="resource-tx"><i>RESOURCE TX STATS</i><p>${resourceTransfer.getHTML()}</p></div>`;
            html += '<hr />';
        });
        html += '</div>';

        this._domRootEl.innerHTML = '';
        this._domRootEl.appendChild(domify(html));
    }
}
