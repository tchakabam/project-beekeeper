import * as React from "react";
import * as ReactDOM from "react-dom";

import { BK_IProxy, BKAccessProxyEvents, BKResource } from "../core";
import { Peer } from "../core/peer";
import { Resource, ResourceEvents } from "../../ext-mod/emliri-es-libs/rialto/lib/resource";

const NULL_STRING = "<null>"

export type BKResourceTransferViewProps = {
    isP2p: boolean
    isUpload: boolean
    resource: Resource
    peer: Peer
}

export class BKResourceTransferView extends React.Component<BKResourceTransferViewProps> {

    constructor(props: BKResourceTransferViewProps) {
        super(props);
    }

    getTransmittedBytes(): number {
        return this.props.resource.requestedBytesLoaded;
    }

    render(): React.ReactNode {
        const loaded = this.props.resource.requestedBytesLoaded;
        const total = this.props.resource.requestedBytesTotal;
        const txKbps = (8 * this.props.resource.requestedBytesLoaded
            / this.props.resource.fetchLatency) / 1000;

        return(
            <div>
                Direction: {this.props.isUpload ? 'UPLOAD' : 'DOWNLOAD'}
                <br/>
                <span><label>URL:</label>{this.props.resource.getUrl()}</span><br/>
                | <span>
                    <label>Peer</label>:
                    { this.props.peer ? this.props.peer.id : NULL_STRING }
                    /
                    { this.props.peer ? this.props.peer.remoteAddress : NULL_STRING }
                  </span>
                | <span>{ this.props.isP2p ? 'P2P' : 'HTTP' }</span>
                | <span><label>Transferred (bytes):</label> {loaded} / {total}</span>
                | <span><label>Bitrate (kbits/sec): </label> {txKbps.toFixed(1)}</span>
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

export type  BKProxyBaseMonitorProps = {
    proxy: BK_IProxy
};

export class BKProxyBaseMonitor extends React.Component<BKProxyBaseMonitorProps> {

    private _resourceTransfers: BKResourceTransferView[] = [];

    static renderDOM(elRootId, proxy: BK_IProxy) {
        ReactDOM.render(
            <BKProxyBaseMonitor proxy={proxy}></BKProxyBaseMonitor>,
            document.getElementById(elRootId)
        );
    }

    constructor(props) {

        super(props);

        this.props.proxy.on(BKAccessProxyEvents.ResourceEnqueuedHttp, (res: BKResource) => {
            this._addResourceTransfer(res, false, false, null);
        });

        this.props.proxy.on(BKAccessProxyEvents.ResourceEnqueuedP2p, (res: BKResource) => {
            this._addResourceTransfer(res, false, true, null);
        });

        this.props.proxy.on(BKAccessProxyEvents.PeerResponseSent, (res: BKResource, peer: Peer) => {
            this._addResourceTransfer(res, true, true, peer);
        });
    }

    render(): React.ReactNode {
        const stats = this.getStats();
        const resourceTxs = [];

        this._resourceTransfers.forEach((resourceTransfer: BKResourceTransferView, index: number) => {
            resourceTxs.push((
                <li key={index}>
                    <i>RESOURCE TX STATS</i>
                    <p>
                        <BKResourceTransferView key={index} {...resourceTransfer.props}></BKResourceTransferView>
                    </p>
                    <hr />
                </li>
            ));
        });

        return(
            <div>
                <label>Overall stats:</label>
                <div>
                    <pre>{ JSON.stringify(stats, null, 2)  }</pre>
                </div>

                <div>
                    <ul>
                        {resourceTxs}
                    </ul>
                </div>
            </div>
        );
    }

    public getStats(): BKProxyBaseMonitorStats {
        let cdnDownloadedBytes = 0;
        let peerDownloadedBytes = 0;
        let peerUploadedBytes = 0;
        let p2pDownloadRatio = 0;
        let p2pUploadRatio = 0;

        this._resourceTransfers.forEach((resourceTx: BKResourceTransferView) => {
            if (resourceTx.props.isUpload) {
                peerUploadedBytes += resourceTx.getTransmittedBytes()
            } else {
                if (resourceTx.props.isP2p) {
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

    private _addResourceTransfer(resource: BKResource, isUpload: boolean, isP2p: boolean, peer: Peer) {

        resource.on(ResourceEvents.FETCH_PROGRESS, () => this.forceUpdate());
        resource.on(ResourceEvents.FETCH_ABORTED, () => this.forceUpdate());
        resource.on(ResourceEvents.FETCH_SUCCEEDED, () => this.forceUpdate());
        resource.on(ResourceEvents.FETCH_ERRORED, () => this.forceUpdate());

        this._resourceTransfers.push(new BKResourceTransferView({
            resource,
            isP2p,
            isUpload,
            peer
        }));

        this.forceUpdate();
    }
}
