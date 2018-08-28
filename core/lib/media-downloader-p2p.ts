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

import * as Debug from "debug";

import {Client} from "bittorrent-tracker";
import {createHash} from "crypto";
import {StringlyTypedEventEmitter} from "./stringly-typed-event-emitter";
import {MediaPeer} from "./media-peer";
import {InternalSegmentData} from "./internal-segment";
import { MediaSegment, MediaSegmentStatus, MediaSegmentsMapData } from "./media-segment";
import { MediaPeerTransportFilterFactory, IMediaPeerTransport } from "./media-peer-transport";

const PEER_PROTOCOL_VERSION = 1;

class PeerSegmentRequest {
    constructor(
        readonly peerId: string,
        readonly segment: MediaSegment
    ) {}
}

export interface ITrackerClient  {
    on(event: string, callback: (data: any) => void): void;
    start(): void;
    stop(): void;
    destroy(): void;
}

export class MediaDownloaderP2p extends StringlyTypedEventEmitter<
    "peer-connected" | "peer-closed" | "peer-data-updated" |
    "segment-loaded" | "segment-error" |
    "bytes-downloaded" | "bytes-uploaded"
> {

    private trackerClient: ITrackerClient | null = null;
    private peers: Map<string, MediaPeer> = new Map();
    private peerCandidates: Map<string, MediaPeer[]> = new Map();
    private peerSegmentRequests: Map<string, PeerSegmentRequest> = new Map();
    private swarmId: string | null = null;
    private peerId: string;
    private debug = Debug("p2pml:p2p-media-manager");

    public constructor(
            readonly cachedSegments: Map<string, InternalSegmentData>,
            readonly settings: {
                useP2P: boolean,
                trackerAnnounce: string[],
                p2pSegmentDownloadTimeout: number,
                webRtcMaxMessageSize: number,
                mediaPeerTransportFilterFactory: MediaPeerTransportFilterFactory
                rtcConfig?: RTCConfiguration,
            }) {
        super();

        this.peerId = createHash("sha1").update((Date.now() + Math.random()).toFixed(12)).digest("hex");

        this.debug("peer ID", this.peerId);
    }

    public setSwarmId(swarmId: string): void {
        if (this.swarmId === swarmId) {
            return;
        }

        this.destroy();

        this.swarmId = swarmId;
        this.debug("swarm ID", this.swarmId);
        this.createClient(createHash("sha1").update(PEER_PROTOCOL_VERSION + this.swarmId).digest("hex"));
    }

    private createClient(infoHash: string): void {
        if (!this.settings.useP2P) {
            return;
        }

        const clientOptions = {
            infoHash: infoHash,
            peerId: this.peerId,
            announce: this.settings.trackerAnnounce,
            rtcConfig: this.settings.rtcConfig
        };

        this.trackerClient = new Client(clientOptions);
        if (!this.trackerClient) {
            throw new Error('Tracker client instance does not exist');
        }

        // TODO: Add better handling here
        this.trackerClient.on("error", (error: any) => this.debug("tracker error", error));
        this.trackerClient.on("warning", (error: any) => this.debug("tracker warning", error));
        this.trackerClient.on("update", (data: any) => this.debug("tracker update", data));
        this.trackerClient.on("peer", this.onTrackerPeer.bind(this));

        this.trackerClient.start();
    }

    private onTrackerPeer(trackerPeer: IMediaPeerTransport): void {
        this.debug("tracker peer", trackerPeer.id, trackerPeer);

        if (this.peers.has(trackerPeer.id)) {
            this.debug("tracker peer already connected", trackerPeer.id, trackerPeer);
            trackerPeer.destroy();
            return;
        }

        const getTransportWrapper = this.settings.mediaPeerTransportFilterFactory;
        const mediaPeerTransport: IMediaPeerTransport = getTransportWrapper(trackerPeer);
        const peer = new MediaPeer(mediaPeerTransport, this.settings);

        peer.on("connect", this.onPeerConnect);
        peer.on("close", this.onPeerClose);
        peer.on("data-updated", this.onPeerDataUpdated);
        peer.on("segment-request", this.onSegmentRequest);
        peer.on("segment-loaded", this.onSegmentLoaded);
        peer.on("segment-absent", this.onSegmentAbsent);
        peer.on("segment-error", this.onSegmentError);
        peer.on("segment-timeout", this.onSegmentTimeout);
        peer.on("bytes-downloaded", this.onPieceBytesDownloaded);
        peer.on("bytes-uploaded", this.onPieceBytesUploaded);

        let peerCandidatesById = this.peerCandidates.get(peer.id);

        if (!peerCandidatesById) {
            peerCandidatesById = [];
            this.peerCandidates.set(peer.id, peerCandidatesById);
        }

        peerCandidatesById.push(peer);
    }

    public download(segment: MediaSegment): boolean {
        if (this.isDownloading(segment)) {
            return false;
        }

        const entries = this.peers.values();
        for (let entry = entries.next(); !entry.done; entry = entries.next()) {
            const peer = entry.value;
            if ((peer.getDownloadingSegmentId() == null) &&
                    (peer.getSegmentsMap().get(segment.id) === MediaSegmentStatus.Loaded)) {
                peer.requestSegment(segment.id);
                this.peerSegmentRequests.set(segment.id, new PeerSegmentRequest(peer.id, segment));
                return true;
            }
        }

        return false;
    }

    public abort(segment: MediaSegment): void {
        const peerSegmentRequest = this.peerSegmentRequests.get(segment.id);
        if (peerSegmentRequest) {
            const peer = this.peers.get(peerSegmentRequest.peerId);
            if (peer) {
                peer.cancelSegmentRequest();
            }
            this.peerSegmentRequests.delete(segment.id);
        }
    }

    public isDownloading(segment: MediaSegment): boolean {
        return this.peerSegmentRequests.has(segment.id);
    }

    public getActiveDownloadsCount(): number {
        return this.peerSegmentRequests.size;
    }

    public destroy(): void {
        this.swarmId = null;

        if (this.trackerClient) {
            this.trackerClient.stop();
            this.trackerClient.destroy();
            this.trackerClient = null;
        }

        this.peers.forEach((peer) => peer.destroy());
        this.peers.clear();

        this.peerSegmentRequests.clear();

        this.peerCandidates.forEach((peerCandidateById) => {
            for (const peerCandidate of peerCandidateById) {
                peerCandidate.destroy();
            }
        });
        this.peerCandidates.clear();
    }

    public sendSegmentsMapToAll(segmentsMap: MediaSegmentsMapData): void {
        this.peers.forEach((peer) => peer.sendSegmentsMap(segmentsMap));
    }

    public sendSegmentsMap(peerId: string, segmentsMap: MediaSegmentsMapData): void {
        const peer = this.peers.get(peerId);
        if (peer) {
            peer.sendSegmentsMap(segmentsMap);
        }
    }

    public getOvrallSegmentsMap(): Map<string, MediaSegmentStatus> {
        const overallSegmentsMap: Map<string, MediaSegmentStatus> = new Map();
        this.peers.forEach(peer => peer.getSegmentsMap().forEach((segmentStatus, segmentId) => {
            if (segmentStatus === MediaSegmentStatus.Loaded) {
                overallSegmentsMap.set(segmentId, MediaSegmentStatus.Loaded);
            } else if (!overallSegmentsMap.get(segmentId)) {
                overallSegmentsMap.set(segmentId, MediaSegmentStatus.LoadingByHttp);
            }
        }));

        return overallSegmentsMap;
    }

    private onPieceBytesDownloaded = (bytes: number) => {
        this.emit("bytes-downloaded", bytes);
    }

    private onPieceBytesUploaded = (bytes: number) => {
        this.emit("bytes-uploaded", bytes);
    }

    private onPeerConnect = (peer: MediaPeer) => {
        const connectedPeer = this.peers.get(peer.id);

        if (connectedPeer) {
            this.debug("tracker peer already connected (in peer connect)", peer.id, peer);
            peer.destroy();
            return;
        }

        // First peer with the ID connected
        this.peers.set(peer.id, peer);

        // Destroy all other peer candidates
        const peerCandidatesById = this.peerCandidates.get(peer.id);
        if (peerCandidatesById) {
            for (const peerCandidate of peerCandidatesById) {
                if (peerCandidate != peer) {
                    peerCandidate.destroy();
                }
            }

            this.peerCandidates.delete(peer.id);
        }

        this.emit("peer-connected", {id: peer.id, remoteAddress: peer.remoteAddress});
    }

    private onPeerClose = (peer: MediaPeer) => {
        if (this.peers.get(peer.id) != peer) {
            // Try to delete the peer candidate

            const peerCandidatesById = this.peerCandidates.get(peer.id);
            if (!peerCandidatesById) {
                return;
            }

            const index = peerCandidatesById.indexOf(peer);
            if (index != -1) {
                peerCandidatesById.splice(index, 1);
            }

            if (peerCandidatesById.length == 0) {
                this.peerCandidates.delete(peer.id);
            }

            return;
        }

        this.peerSegmentRequests.forEach((value, key) => {
            if (value.peerId == peer.id) {
                this.peerSegmentRequests.delete(key);
            }
        });

        this.peers.delete(peer.id);
        this.emit("peer-data-updated");
        this.emit("peer-closed", peer.id);
    }

    private onPeerDataUpdated = () => {
        this.emit("peer-data-updated");
    }

    private onSegmentRequest = (peer: MediaPeer, segmentId: string) => {
        const segment = this.cachedSegments.get(segmentId);
        if (segment) {
            peer.sendSegmentData(segmentId, segment.data!);
        } else {
            peer.sendSegmentAbsent(segmentId);
        }
    }

    private onSegmentLoaded = (peer: MediaPeer, segmentId: string, data: ArrayBuffer) => {
        const peerSegmentRequest = this.peerSegmentRequests.get(segmentId);
        if (peerSegmentRequest) {
            this.peerSegmentRequests.delete(segmentId);
            this.emit("segment-loaded", peerSegmentRequest.segment, data);
        }
    }

    private onSegmentAbsent = (peer: MediaPeer, segmentId: string) => {
        this.peerSegmentRequests.delete(segmentId);
        this.emit("peer-data-updated");
    }

    private onSegmentError = (peer: MediaPeer, segmentId: string, description: string) => {
        const peerSegmentRequest = this.peerSegmentRequests.get(segmentId);
        if (peerSegmentRequest) {
            this.peerSegmentRequests.delete(segmentId);
            this.emit("segment-error", peerSegmentRequest.segment, description);
        }
    }

    private onSegmentTimeout = (peer: MediaPeer, segmentId: string) => {
        const peerSegmentRequest = this.peerSegmentRequests.get(segmentId);
        if (peerSegmentRequest) {
            this.peerSegmentRequests.delete(segmentId);
            peer.destroy();
            if (this.peers.delete(peerSegmentRequest.peerId)) {
                this.emit("peer-data-updated");
            }
        }
    }
}