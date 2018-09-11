/**
 * Copyright 2018 Novage LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/// <reference path="../../decl/bittorrent.d.ts" />

const uuidv4 = require('uuid/v4');

import * as Debug from "debug";

import {Client} from "bittorrent-tracker";
import {createHash} from "crypto";

import {StringlyTypedEventEmitter} from "./stringly-typed-event-emitter";
import {Peer} from "./peer";
import { BKResource, BKResourceStatus, BKResourceMapData } from "./bk-resource";
import { PeerTransportFilterFactory, IPeerTransport } from "./peer-transport";

const PEER_PROTOCOL_VERSION = 1;

// implement actual IResourceRequest
class PeerResourceTransfer {
    constructor(
        readonly peerId: string,
        readonly resource: BKResource
    ) {}
}

export interface ITrackerClient  {
    on(event: string, callback: (data: any) => void): void;
    start(): void;
    stop(): void;
    destroy(): void;
}

export class PeerAgent extends StringlyTypedEventEmitter<
    "peer-connected" | "peer-closed" | "peer-data-updated" |
    "segment-loaded" | "segment-error" |
    "bytes-downloaded" | "bytes-uploaded"
> {

    private _trackerClient: ITrackerClient | null = null;
    private _peers: Map<string, Peer> = new Map();
    private _peerCandidates: Map<string, Peer[]> = new Map();
    private _peerResourceTransfers: Map<string, PeerResourceTransfer> = new Map();
    private _swarmId: string | null = null;
    private _peerId: string;

    private debug = Debug("bk:core:downloader-p2p");

    public constructor(
            readonly cachedSegments: Map<string, BKResource>,
            readonly settings: {
                useP2P: boolean,
                trackerAnnounce: string[],
                p2pSegmentDownloadTimeout: number,
                webRtcMaxMessageSize: number,
                mediaPeerTransportFilterFactory: PeerTransportFilterFactory
                rtcConfig?: RTCConfiguration,
            }) {
        super();


        //const peerIdSource = (Date.now() + Math.random()).toFixed(12);
        // FIXED: using a real UUID is better at scale :)
        const peerIdSource = uuidv4(); // see https://www.npmjs.com/package/uuid

        this._peerId = createHash("sha1").update(peerIdSource).digest("hex");

        this.debug("peer ID", this._peerId);
    }

    public enqueue(resource: BKResource): boolean {
        if (this.isDownloading(resource)) {
            return false;
        }

        const entries = this._peers.values();
        for (let entry = entries.next(); !entry.done; entry = entries.next()) {
            const peer = entry.value;
            if ((peer.getDownloadingSegmentId() == null) &&
                    (peer.getSegmentsMap().get(resource.id) === BKResourceStatus.Loaded)) {
                peer.requestSegment(resource.id);
                this._peerResourceTransfers.set(resource.id, new PeerResourceTransfer(peer.id, resource));
                return true;
            }
        }

        return false;
    }

    public abort(segment: BKResource): void {
        const peerSegmentRequest = this._peerResourceTransfers.get(segment.id);
        if (peerSegmentRequest) {
            const peer = this._peers.get(peerSegmentRequest.peerId);
            if (peer) {
                peer.cancelSegmentRequest();
            }
            this._peerResourceTransfers.delete(segment.id);
        }
    }

    public isDownloading(segment: BKResource): boolean {
        return this._peerResourceTransfers.has(segment.id);
    }

    public getActiveDownloadsCount(): number {
        return this._peerResourceTransfers.size;
    }

    public destroy(): void {
        this._swarmId = null;

        if (this._trackerClient) {
            this._trackerClient.stop();
            this._trackerClient.destroy();
            this._trackerClient = null;
        }

        this._peers.forEach((peer) => peer.destroy());
        this._peers.clear();

        this._peerResourceTransfers.clear();

        this._peerCandidates.forEach((peerCandidateById) => {
            for (const peerCandidate of peerCandidateById) {
                peerCandidate.destroy();
            }
        });
        this._peerCandidates.clear();
    }

    public sendSegmentsMapToAll(segmentsMap: BKResourceMapData): void {

        this.debug("sending chunk-map to all")

        this._peers.forEach((peer) => peer.sendSegmentsMap(segmentsMap));
    }

    public sendSegmentsMap(peerId: string, segmentsMap: BKResourceMapData): void {
        const peer = this._peers.get(peerId);
        if (peer) {
            peer.sendSegmentsMap(segmentsMap);
        }
    }

    public getOverallSegmentsMap(): Map<string, BKResourceStatus> {
        const overallSegmentsMap: Map<string, BKResourceStatus> = new Map();
        this._peers.forEach(peer => peer.getSegmentsMap().forEach((segmentStatus, segmentId) => {
            if (segmentStatus === BKResourceStatus.Loaded) {
                overallSegmentsMap.set(segmentId, BKResourceStatus.Loaded);
            } else if (!overallSegmentsMap.get(segmentId)) {
                overallSegmentsMap.set(segmentId, BKResourceStatus.LoadingViaHttp);
            }
        }));

        return overallSegmentsMap;
    }

    public getPeerId(): string {
        return this._peerId;
    }

    public getSwarmId(): string {
        return this._swarmId;
    }

    public setSwarmId(swarmId: string): void {
        if (this._swarmId === swarmId) {
            return;
        }

        this.destroy();

        this._swarmId = swarmId;
        this.debug("swarm ID", this._swarmId);

        // Q: check what this hash is really about
        this._createClient(createHash("sha1").update(PEER_PROTOCOL_VERSION + this._swarmId).digest("hex"));
    }

    public getPeerConnections(): Peer[] {
        return Array.from(this._peers.values());
    }

    private _createClient(infoHash: string): void {
        if (!this.settings.useP2P) {
            return;
        }

        const clientOptions = {
            infoHash: infoHash,
            peerId: this._peerId,
            announce: this.settings.trackerAnnounce,
            rtcConfig: this.settings.rtcConfig
        };

        this._trackerClient = new Client(clientOptions);
        if (!this._trackerClient) {
            throw new Error('Tracker client instance does not exist');
        }

        // TODO: Add better handling here
        this._trackerClient.on("error", this._onTrackerError.bind(this));
        this._trackerClient.on("warning", this._onTrackerWarning.bind(this));
        this._trackerClient.on("update", this._onTrackerUpdate.bind(this));
        this._trackerClient.on("peer", this._onTrackerPeer.bind(this));

        this._trackerClient.start();
    }

    private _onTrackerError(data: any) {
        console.error("Tracker-client error:", data);

        throw new Error("Unhandled Beekeepr error");
    }

    private _onTrackerWarning(data: any) {
        console.warn("Tracker-client warning:", data);
    }

    private _onTrackerUpdate(data: any) {
        this.debug("Tracker-client update:", data);
    }

    private _onTrackerPeer(trackerPeer: IPeerTransport): void {
        this.debug("tracker peer", trackerPeer.id, trackerPeer);

        if (this._peers.has(trackerPeer.id)) {
            this.debug("tracker peer already connected", trackerPeer.id, trackerPeer);
            trackerPeer.destroy();
            return;
        }

        const getTransportWrapper = this.settings.mediaPeerTransportFilterFactory;
        const mediaPeerTransport: IPeerTransport = getTransportWrapper(trackerPeer);
        const peer = new Peer(mediaPeerTransport, this.settings);

        peer.on("connect", this._onPeerConnect);
        peer.on("close", this._onPeerClose);
        peer.on("data-updated", this._onPeerDataUpdated);
        peer.on("segment-request", this._onSegmentRequest);
        peer.on("segment-loaded", this._onSegmentLoaded);
        peer.on("segment-absent", this._onSegmentAbsent);
        peer.on("segment-error", this._onSegmentError);
        peer.on("segment-timeout", this._onSegmentTimeout);
        peer.on("bytes-downloaded", this._onChunkBytesDownloaded);
        peer.on("bytes-uploaded", this._onChunkBytesUploaded);

        let peerCandidatesById = this._peerCandidates.get(peer.id);
        if (!peerCandidatesById) {
            peerCandidatesById = [];
            this._peerCandidates.set(peer.id, peerCandidatesById);
        }

        peerCandidatesById.push(peer);
    }

    private _onChunkBytesDownloaded = (bytes: number) => {
        this.emit("bytes-downloaded", bytes);
    }

    private _onChunkBytesUploaded = (bytes: number) => {
        this.emit("bytes-uploaded", bytes);
    }

    private _onPeerConnect = (peer: Peer) => {
        const connectedPeer = this._peers.get(peer.id);

        if (connectedPeer) {
            this.debug("tracker peer already connected (in peer connect)", peer.id, peer);
            peer.destroy();
            return;
        }

        // First peer with the ID connected
        this._peers.set(peer.id, peer);

        // Destroy all other peer candidates
        const peerCandidatesById = this._peerCandidates.get(peer.id);
        if (peerCandidatesById) {
            for (const peerCandidate of peerCandidatesById) {
                if (peerCandidate != peer) {
                    peerCandidate.destroy();
                }
            }

            this._peerCandidates.delete(peer.id);
        }

        this.emit("peer-connected", {id: peer.id, remoteAddress: peer.remoteAddress});
    }

    private _onPeerClose = (peer: Peer) => {
        if (this._peers.get(peer.id) != peer) {
            // Try to delete the peer candidate

            const peerCandidatesById = this._peerCandidates.get(peer.id);
            if (!peerCandidatesById) {
                return;
            }

            const index = peerCandidatesById.indexOf(peer);
            if (index != -1) {
                peerCandidatesById.splice(index, 1);
            }

            if (peerCandidatesById.length == 0) {
                this._peerCandidates.delete(peer.id);
            }

            return;
        }

        this._peerResourceTransfers.forEach((value, key) => {
            if (value.peerId == peer.id) {
                this._peerResourceTransfers.delete(key);
            }
        });

        this._peers.delete(peer.id);
        this.emit("peer-data-updated");
        this.emit("peer-closed", peer.id);
    }

    private _onPeerDataUpdated = () => {
        this.emit("peer-data-updated");
    }

    private _onSegmentRequest = (peer: Peer, segmentId: string) => {
        const segment = this.cachedSegments.get(segmentId);
        if (segment) {
            peer.sendSegmentData(segmentId, segment.data!);
        } else {
            peer.sendSegmentAbsent(segmentId);
        }
    }

    private _onSegmentLoaded = (peer: Peer, segmentId: string, data: ArrayBuffer) => {

        this.debug(`resource "${segmentId}" loaded from peer (id=${peer.id})`);

        const peerResourceRequest = this._peerResourceTransfers.get(segmentId);
        if (peerResourceRequest) {
            this._peerResourceTransfers.delete(segmentId);

            const res = peerResourceRequest.resource;

            res.setExternalyFetchedBytes(data.byteLength, data.byteLength);
            res.setBuffer(data);

            this.emit("segment-loaded", peerResourceRequest.resource, data);
        }
    }

    private _onSegmentAbsent = (peer: Peer, segmentId: string) => {
        this._peerResourceTransfers.delete(segmentId);
        this.emit("peer-data-updated");
    }

    private _onSegmentError = (peer: Peer, segmentId: string, description: string) => {
        const peerResourceRequest = this._peerResourceTransfers.get(segmentId);
        if (peerResourceRequest) {
            this._peerResourceTransfers.delete(segmentId);
            this.emit("segment-error", peerResourceRequest.resource, description);
        }
    }

    private _onSegmentTimeout = (peer: Peer, segmentId: string) => {
        const peerResourceRequest = this._peerResourceTransfers.get(segmentId);
        if (peerResourceRequest) {
            this._peerResourceTransfers.delete(segmentId);
            peer.destroy();
            if (this._peers.delete(peerResourceRequest.peerId)) {
                this.emit("peer-data-updated");
            }
        }
    }
}
