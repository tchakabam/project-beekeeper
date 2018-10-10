import { BKResource } from '../core';
import { BK_IProxy } from '../core/bk-access-proxy';
import { Peer } from './peer';
export declare class BKResourceTransferMonitorDomView {
    private _proxy;
    private _resourceTransfers;
    private _domRootEl;
    constructor(_proxy: BK_IProxy, domRootId: string);
    addResourceDownload(res: BKResource, isP2p: boolean): void;
    addResourceUpload(res: BKResource, peer: Peer): void;
    getOverallStats(): {
        p2pDownloadRatio: number;
        p2pUploadRatio: number;
        cdnDownloadedBytes: number;
        peerDownloadedBytes: number;
        peerUploadedBytes: number;
    };
    update(): void;
}
