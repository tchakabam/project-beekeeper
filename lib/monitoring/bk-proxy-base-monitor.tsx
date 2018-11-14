import React = require("react");
import ReactDOM = require("react-dom");

import { BK_IProxy, BKAccessProxyEvents, BKResource } from "../core";
import { BKPeer } from "../core/peer";
import { Resource, ResourceEvents } from "../../ext-mod/emliri-es-libs/rialto/lib/resource";
import { printObject } from "./print-object";

const NULL_STRING = "<null>"

export type BKResourceTransferViewProps = {
    isP2p: boolean
    isUpload: boolean
    resource: Resource
    peerName: string
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

        let txKbps = NaN;
        if (this.props.isUpload) {
            //txKbps =
        } else {
            txKbps = this.props.resource.getRecordedTransmissionRateBps() / 1000;
        }

        return(
            <div className={"resource-tx " + (this.props.isUpload ? "resource-ul" : "resource-dl")}>
                Direction: {this.props.isUpload ? 'UPLOAD' : 'DOWNLOAD'}
                <ul>
                    <li><label>URL:&nbsp;</label>{this.props.resource.getUrl()}</li>
                    <li>
                        <label>Peer short-name:&nbsp;</label>
                        { this.props.peerName ? this.props.peerName : NULL_STRING }
                    </li>
                    <li><label>Mode:&nbsp;</label>{ this.props.isP2p ? 'P2P' : 'HTTP' }</li>
                    <li><label>Transferred (bytes):&nbsp;</label>{loaded} / {total}</li>
                    <li><label>Bitrate (kbits/sec):&nbsp;</label>{txKbps.toFixed(1)}</li>
                </ul>
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

    static renderDOM(elRootId, proxy: BK_IProxy) {
        ReactDOM.render(
            <BKProxyBaseMonitor proxy={proxy}></BKProxyBaseMonitor>,
            document.getElementById(elRootId)
        );
    }

    private _resourceTransfers: BKResourceTransferView[] = [];

    constructor(props) {

        super(props);

        // DOWNLOADS
        this.props.proxy.on(BKAccessProxyEvents.ResourceEnqueuedHttp, (res: BKResource) => {
            this._addResourceTransfer(res, false, false, null);
        });

        this.props.proxy.on(BKAccessProxyEvents.ResourceEnqueuedP2p, (res: BKResource) => {
            this._addResourceTransfer(res, false, true, null);
        });

        // UPLOAD
        this.props.proxy.on(BKAccessProxyEvents.PeerResponseSent, (res: BKResource, peer: BKPeer) => {
            this._addResourceTransfer(res, true, true, peer);
        });
    }

    render(): React.ReactNode {
        const stats = this.getStats();
        const resourceTxs = [];

        this._resourceTransfers.forEach((resourceTransfer: BKResourceTransferView, index: number) => {
            resourceTxs.push((
                <li key={index} style={{width: '80%'}}>
                    <b>Resource transmission:</b>
                    <BKResourceTransferView key={index} {...resourceTransfer.props}></BKResourceTransferView>
                    <hr />
                </li>
            ));
        });

        return(
            <div>
                <label>Overall stats:</label>
                <div>
                    <pre>{ printObject(stats)  }</pre>
                </div>

                <div style={{
                        height: '400px',
                        overflowY: 'scroll',
                        border: '1px solid gray',
                        paddingBottom: '1em',
                        marginBottom: '2em',
                    }}>
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

    private _addResourceTransfer(resource: BKResource, isUpload: boolean, isP2p: boolean, peer: BKPeer) {

        resource.on(ResourceEvents.FETCH_PROGRESS, () => this.forceUpdate());
        resource.on(ResourceEvents.FETCH_ABORTED, () => this.forceUpdate());
        resource.on(ResourceEvents.FETCH_SUCCEEDED, () => this.forceUpdate());
        resource.on(ResourceEvents.FETCH_ERRORED, () => this.forceUpdate());

        this._resourceTransfers.push(new BKResourceTransferView({
            resource,
            isP2p,
            isUpload,
            peerName: peer ? peer.getShortName() : resource.peerShortName // using the peer uploaded to,
                                                                        // or the resource origin in case of download
        }));

        this.forceUpdate();
    }
}
