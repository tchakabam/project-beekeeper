import * as React from "react";
import * as ReactDOM from "react-dom";

import { BK_IProxy, BKAccessProxyEvents, BKResource } from "../core";
import { Peer } from "../core/peer";
import { Resource } from "../../ext-mod/emliri-es-libs/rialto/lib/resource";

class BKResourceTransferView extends React.Component {

    private _peer: Peer = null;
    private _resource: Resource = null;

    readonly isUpload: boolean = false;
    readonly isP2P: boolean = false;

    constructor(props) {
        super(props);

        this.isP2P = props.isP2P;
        this.isUpload = props.isUpload;

        this._resource = props.resource;
        this._peer = props.peer;
    }

    getTransmittedBytes(): number {
        return this._resource.requestedBytesLoaded;
    }

    render(): React.ReactNode {
        const loaded = this._resource.requestedBytesLoaded;
        const total = this._resource.requestedBytesTotal;

        return(
            <div>
                Direction: UPLOAD<br/>
                <span>
                    <label>URL:</label>${this._resource.getUrl()}</span>
                    <br/>| <span><label>Peer</label>: ${ this._peer.id } / ${this._peer.remoteAddress}</span>
                | <span>${ true ? 'P2P' : 'HTTP' }</span>
                | <span>
                    <label>Transferred (bytes):</label> {loaded} / {total}
                </span>
            </div>
        );
    }
}

export type BKProxyBaseMonitorStats = {
    p2pDownloadRatio: number,
    p2pUploadRatio: number,
    cdnDownloadedBytes: number,
    peerDownloadedBytes: number,
    peerUploadedBytes: number
}

export class BKProxyBaseMonitor extends React.Component {

    private _resourceTransfers: BKResourceTransferView[] = [];
    private _proxy: BK_IProxy = null;

    static createReactDOM(elRootId) {
        ReactDOM.render(
            <BKProxyBaseMonitor></BKProxyBaseMonitor>,
            document.getElementById(elRootId)
        );
    }

    constructor(props) {

        super(props);

        this._proxy = props.proxy;

        this._proxy.on(BKAccessProxyEvents.ResourceEnqueuedHttp, (res: BKResource) => {
            this._addResourceDownload(res, false);
        });

        this._proxy.on(BKAccessProxyEvents.ResourceEnqueuedP2p, (res: BKResource) => {
            this._addResourceDownload(res, true);
        });

        this._proxy.on(BKAccessProxyEvents.PeerResponseSent, (res: BKResource, peer: Peer) => {
            this._addResourceUpload(res, peer);
        });
    }

    render(): React.ReactNode {
        return <div></div>
    }

    private _addResourceDownload(res: BKResource, isP2p: boolean) {

    }

    private _addResourceUpload(res: BKResource, peer: Peer) {

    }

    private _getOverallStats(): BKProxyBaseMonitorStats {
        let cdnDownloadedBytes = 0;
        let peerDownloadedBytes = 0;
        let peerUploadedBytes = 0;
        let p2pDownloadRatio = 0;
        let p2pUploadRatio = 0;

        this._resourceTransfers.forEach((resourceTx: BKResourceTransferView) => {
            if (resourceTx.isUpload) {
                peerUploadedBytes += resourceTx.getTransmittedBytes()
            } else {
                if (resourceTx.isP2P) {
                    peerDownloadedBytes += resourceTx.getTransmittedBytes();
                } else {
                    cdnDownloadedBytes += resourceTx.getTransmittedBytes();
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
}
