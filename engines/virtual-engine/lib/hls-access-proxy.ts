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

/// <reference path="../../../decl/m3u8-parser.d.ts" />

//import * as Debug from "debug";
import {Parser} from "m3u8-parser";

import {Events, MediaSegment, IMediaDownloader} from "../../../core/lib";
import Utils from "./utils";

import * as Debug from "debug";

const debug = Debug("p2pml:virtual:segment-manager");

const defaultSettings: Settings = {
    forwardSegmentCount: 20
};

export class HlsAccessProxy {

    private loader: IMediaDownloader;
    private masterPlaylist: Playlist | null = null;
    private variantPlaylists: Map<string, Playlist> = new Map();
    private segmentRequest: SegmentRequest | null = null;
    private playQueue: {segmentSequence: number, segmentUrl: string}[] = [];
    private readonly settings: Settings;

    public constructor(loader: IMediaDownloader, settings: any = {}) {

        debug("created SegmentManager")

        this.settings = Object.assign(defaultSettings, settings);

        this.loader = loader;
        this.loader.on(Events.SegmentLoaded, this.onSegmentLoaded);
        this.loader.on(Events.SegmentError, this.onSegmentError);
        this.loader.on(Events.SegmentAbort, this.onSegmentAbort);
    }

    public getSettings() {
        return this.settings;
    }

    public processPlaylist(url: string, content: string): void {

        debug(`processing playlist (parsing) for url: ${url}`);

        const parser = new Parser();
        parser.push(content);
        parser.end();

        const playlist = new Playlist(url, parser.manifest);

        if (playlist.manifest.playlists) {

            debug('found master playlist')

            this.masterPlaylist = playlist;
            this.variantPlaylists.forEach(playlist => playlist.swarmId = this.getSwarmId(playlist.url));
            // TODO: validate that playlist was not changed

        } else {

            debug('found variant playlist')

            const swarmId = this.getSwarmId(url);

            debug(`created new swarm ID (${swarmId}) for url (${url})`)

            if (swarmId !== url || !this.masterPlaylist) {
                playlist.swarmId = swarmId;
                this.variantPlaylists.set(url, playlist);
                this.updateSegments();
            }
        }
    }

    public hasMasterPlaylist(): boolean {
        return !! this.masterPlaylist;
    }

    public getMasterPlaylistBaseUrl(): string | null{
        return this.masterPlaylist ? this.masterPlaylist.baseUrl : null;
    }

    public getVariantPlaylistUrls(): string[] {
        if (this.masterPlaylist && this.masterPlaylist.manifest) {
            const baseUrl: string = this.masterPlaylist.baseUrl;
            return this.masterPlaylist.manifest.playlists
                // TODO: use URLToolkit here to resolve
                .map((playlist: any) => (baseUrl + playlist.uri as string));
        }
        return [];
    }

    public getVariantPlaylists(): Playlist[] {
        return Array.from(this.variantPlaylists.values())
    }

    public setPlayingSegment(url: string): void {
        const urlIndex = this.playQueue.findIndex(segment => segment.segmentUrl == url);
        if (urlIndex >= 0) {
            this.playQueue = this.playQueue.slice(urlIndex);
            this.updateSegments();
        }
    }

    public abortSegment(url: string): void {
        if (this.segmentRequest && this.segmentRequest.segmentUrl === url) {
            this.segmentRequest = null;
        }
    }

    public destroy(): void {
        this.loader.destroy();

        if (this.segmentRequest) {
            this.segmentRequest.onError("Loading aborted: object destroyed");
            this.segmentRequest = null;
        }

        this.masterPlaylist = null;
        this.variantPlaylists.clear();
        this.playQueue = [];
    }

    /*
    private loadSegment(url: string, onSuccess: (content: ArrayBuffer, downloadSpeed: number) => void, onError: (error: any) => void): void {
        const segmentLocation = this.getSegmentLocation(url);
        if (!segmentLocation) {
            Utils.fetchContentAsArrayBuffer(url)
                .then((content: ArrayBuffer) => onSuccess(content, 0))
                .catch((error: any) => onError(error));
            return;
        }

        const segmentSequence = (segmentLocation.playlist.manifest.mediaSequence ? segmentLocation.playlist.manifest.mediaSequence : 0)
            + segmentLocation.segmentIndex;

        if (this.playQueue.length > 0) {
            const previousSegment = this.playQueue[this.playQueue.length - 1];
            if (previousSegment.segmentSequence !== segmentSequence - 1) {
                // Reset play queue in case of segment loading out of sequence
                this.playQueue = [];
            }
        }

        if (this.segmentRequest) {
            this.segmentRequest.onError("Cancel segment request: simultaneous segment requests are not supported");
        }

        this.segmentRequest = new SegmentRequest(url, segmentSequence, segmentLocation.playlist.url, onSuccess, onError);
        this.playQueue.push({segmentUrl: url, segmentSequence: segmentSequence});
        this.loadSegments(segmentLocation.playlist, segmentLocation.segmentIndex, true);
    }
    */

    private updateSegments(): void {
        if (!this.segmentRequest) {
            return;
        }

        const segmentLocation = this.getSegmentLocation(this.segmentRequest.segmentUrl);
        if (segmentLocation) {
            this.loadSegments(segmentLocation.playlist, segmentLocation.segmentIndex, false);
        } else { // the segment not found in current playlist
            const playlist = this.variantPlaylists.get(this.segmentRequest.playlistUrl);
            if (playlist) {
                this.loadSegments(playlist, 0, false, {
                    url: this.segmentRequest.segmentUrl,
                    sequence: this.segmentRequest.segmentSequence});
            }
        }
    }

    private onSegmentLoaded = (segment: MediaSegment) => {
        if (this.segmentRequest && this.segmentRequest.segmentUrl === segment.url) {
            this.segmentRequest.onSuccess(segment.data!.slice(0), segment.downloadSpeed);
            this.segmentRequest = null;
        }
    }

    private onSegmentError = (segment: MediaSegment, error: any) => {
        if (this.segmentRequest && this.segmentRequest.segmentUrl === segment.url) {
            this.segmentRequest.onError(error);
            this.segmentRequest = null;
        }
    }

    private onSegmentAbort = (segment: MediaSegment) => {
        if (this.segmentRequest && this.segmentRequest.segmentUrl === segment.url) {
            this.segmentRequest.onError("Loading aborted: internal abort");
            this.segmentRequest = null;
        }
    }

    private getSegmentLocation(url: string): { playlist: Playlist, segmentIndex: number } | undefined {
        const entries = this.variantPlaylists.values();
        for (let entry = entries.next(); !entry.done; entry = entries.next()) {
            const playlist = entry.value;
            const segmentIndex = playlist.getSegmentIndex(url);
            if (segmentIndex >= 0) {
                return { playlist: playlist, segmentIndex: segmentIndex };
            }
        }

        return undefined;
    }

    private loadSegments(playlist: Playlist, segmentIndex: number, requestFirstSegment: boolean, notInPlaylistSegment?: {url: string, sequence: number}): void {
        const segments: MediaSegment[] = [];
        const playlistSegments: any[] = playlist.manifest.segments;
        const initialSequence: number = playlist.manifest.mediaSequence ? playlist.manifest.mediaSequence : 0;
        let loadSegmentId: string | null = null;

        let priority = Math.max(0, this.playQueue.length - 1);

        if (notInPlaylistSegment) {
            const url = playlist.getSegmentAbsoluteUrl(notInPlaylistSegment.url);
            const id = this.getSegmentId(playlist, notInPlaylistSegment.sequence);
            segments.push(new MediaSegment(id, url, undefined, priority++));

            if (requestFirstSegment) {
                loadSegmentId = id;
            }
        }

        for (let i = segmentIndex; i < playlistSegments.length && segments.length < this.settings.forwardSegmentCount; ++i) {
            const url = playlist.getSegmentAbsoluteUrlByIndex(i);
            const id = this.getSegmentId(playlist, initialSequence + i);
            segments.push(new MediaSegment(id, url, undefined, priority++));

            if (requestFirstSegment && !loadSegmentId) {
                loadSegmentId = id;
            }
        }

        this.loader.load(segments, playlist.swarmId);

        if (loadSegmentId) {
            const segment = this.loader.getSegment(loadSegmentId);
            if (segment) { // Segment already loaded by loader
                this.onSegmentLoaded(segment);
            }
        }
    }

    private getSegmentId(playlist: Playlist, segmentSequence: number): string {
        return `${playlist.swarmId}+${segmentSequence}`;
    }

    private getSwarmId(playlistUrl: string): string {
        if (this.masterPlaylist) {
            const masterUrlNoQuery = this.masterPlaylist.url.split("?")[0];

            for (let i = 0; i < this.masterPlaylist.manifest.playlists.length; ++i) {
                let url = this.masterPlaylist.manifest.playlists[i].uri;
                url = Utils.isAbsoluteUrl(url) ? url : this.masterPlaylist.baseUrl + url;
                if (url === playlistUrl) {
                    return `${masterUrlNoQuery}+V${i}`;
                }
            }
        }

        return playlistUrl;
    }

}

class Playlist {
    public baseUrl: string;
    public swarmId: string = "";

    public constructor(
        readonly url: string,
        readonly manifest: any
    ) {

        const pos = url.lastIndexOf("/");
        if (pos === -1) {
            throw new Error("Unexpected playlist URL format");
        }

        this.baseUrl = url.substring(0, pos + 1);
    }

    public getSegmentIndex(url: string): number {
        for (let i = 0; i < this.manifest.segments.length; ++i) {
            if (url === this.getSegmentAbsoluteUrlByIndex(i)) {
                return i;
            }
        }

        return -1;
    }

    public getSegmentAbsoluteUrlByIndex(index: number): string {
        return this.getSegmentAbsoluteUrl(this.manifest.segments[index].uri);
    }

    public getSegmentAbsoluteUrl(segmentUrl: string): string {
        return Utils.isAbsoluteUrl(segmentUrl) ? segmentUrl : this.baseUrl + segmentUrl;
    }

    public hasVariants(): boolean {
        return !! this.manifest.playlists && this.manifest.playlists.length > 0;
    }

    public hasMedia(): boolean {
        return !! this.manifest.segments && this.manifest.segments.length > 0;
    }

    public getMediaFragments(): MediaFragment[] | null {
        let timestamp = 0;
        if (this.manifest.segments && this.manifest.segments.length > 0) {
            return this.manifest.segments.map((segment: any) => {
                const mediaFragment = new MediaFragment(
                    segment.uri,
                    segment.duration,
                    timestamp + segment.timeline
                );
                timestamp += segment.duration;
                return mediaFragment;
            });
        }
        return null
    }
}

class MediaFragment {
    constructor(
        public readonly url: string,
        public readonly duration: number,
        public readonly timestampOffset: number
    ) {}
}

class SegmentRequest {
    public constructor(
        readonly segmentUrl: string,
        readonly segmentSequence: number,
        readonly playlistUrl: string,
        readonly onSuccess: (content: ArrayBuffer, downloadSpeed: number) => void,
        readonly onError: (error: any) => void
    ) {}
}

interface Settings {
    /**
     * Number of segments for building up predicted forward segments sequence; used to predownload and share via P2P
     */
    forwardSegmentCount: number;
}
