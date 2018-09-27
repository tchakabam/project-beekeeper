import { Engine } from './engine';
import { BKResourceRequest } from '../core/bk-resource-request';
import { ResourceEvents } from '../../ext-mod/emliri-es-libs/rialto/lib/resource';
import { BKResource } from '../core';
import { BKAccessProxyEvents } from '../core/bk-access-proxy';

const html = require('html-tag');
const domify = require('domify');

class ResourceTransferView {
    constructor(
        private _resource: BKResource,
        private _isP2p: boolean,
        private _monitor: MonitorDomView
    ) {
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

        return `<span><label>URL:</label> ${this._resource.getUrl()}</span><br>
            | <span>${ this._isP2p ? 'P2P' : 'HTTP' }</span>
            | <span><label>Transferred (bytes):</label> ${loaded} / ${total}</span>
            | <span><label>Bitrate (kbits/sec): </label> ${txKbps.toFixed(1)}</span>`;
    }

    private _onFetchProgress() {

        this._monitor.update();
    }

    private _onFetchSucceeded() {

        this._monitor.update();
    }

    private _onFetchErrored() {

    }

    private _onFetchAborted() {

    }
}

export class MonitorDomView {

    private _resourceRequests: ResourceTransferView[] = [];

    private _domRootEl: HTMLElement;

    constructor(
        private _engine: Engine,
        domRootId: string,
    ) {
        this._engine.getProxy().on(BKAccessProxyEvents.ResourceEnqueuedHttp, (res: BKResource) => {
            this.addResource(res, false);
        });

        this._engine.getProxy().on(BKAccessProxyEvents.ResourceEnqueuedP2p, (res: BKResource) => {
            this.addResource(res, true);
        });

        this._domRootEl = document.getElementById(domRootId);
        if (!this._domRootEl) {
            throw new Error(`No root element found with id "${domRootId}"`);
        }

    }

    addResource(resourceRequest: BKResource, isP2p: boolean) {

        this._resourceRequests.push(new ResourceTransferView(resourceRequest, isP2p, this));

        this.update();
    }

    update() {

        // use JSX ?
        let html = '<div>';
        this._resourceRequests.forEach((resourceTransfer: ResourceTransferView) => {
            html += `<div class="resource-dl"><i>Resource download stats</i><p>${resourceTransfer.getHTML()}</p></div>`;
            html += '<hr />';
        });
        html += '</div>';


        this._domRootEl.innerHTML = '';
        this._domRootEl.appendChild(domify(html));
    }
}
