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

import * as Debug from "debug";

import { Events, MediaSegment as P2PMediaSegment, IMediaDownloader } from "../../../core/lib";

import { Scheduler } from "../../../ext-mod/emliri-es-libs/objec-ts/lib/scheduler";

import { HlsM3u8File } from "../../../ext-mod/emliri-es-libs/rialto/lib/hls-m3u8";
import { ResourceRequestMaker, IResourceRequest } from "../../../ext-mod/emliri-es-libs/rialto/lib/resource-request";
import { AdaptiveMediaStreamConsumer } from "../../../ext-mod/emliri-es-libs/rialto/lib/adaptive-media-client"
import { AdaptiveMedia, AdaptiveMediaPeriod } from "../../../ext-mod/emliri-es-libs/rialto/lib/adaptive-media";
import { MediaSegment } from "../../../ext-mod/emliri-es-libs/rialto";
import { XHRData, XHRState } from "../../../ext-mod/emliri-es-libs/rialto/lib/xhr";
import { ByteRange } from "../../../ext-mod/emliri-es-libs/rialto/lib/byte-range";

const SCHEDULER_FRAMERATE: number = 1;

const debug = Debug("p2pml:universal:hls-access");

class P2PMediaDownloaderRequest implements IResourceRequest {
    xhrState: XHRState = XHRState.UNSENT;
    responseData: XHRData = null;
    responseHeaders: object = {};
    loadedBytes: number = 0;
    totalBytes: number = 0;
    hasBeenAborted: boolean = false;
    hasErrored: boolean = false;
    error: Error = null;

    secondsUntilLoading: number = NaN;
    secondsUntilDone: number = NaN;
    secondsUntilHeaders: number = NaN;

    private segment: P2PMediaSegment;

    constructor(
        private url: string,
        private byteRange: ByteRange,
        private downloader: IMediaDownloader,
        private swarmId: string
    ) {

        this.downloader.on(Events.SegmentLoaded, this.onSegmentLoaded);
        this.downloader.on(Events.SegmentError, this.onSegmentError);
        this.downloader.on(Events.SegmentAbort, this.onSegmentAbort);

        const segment: P2PMediaSegment = this.segment = new P2PMediaSegment(
            url,
            url,
            this.byteRange ? this.byteRange.toHttpHeaderValue() : null
        );

        this.downloader.load([segment], this.swarmId);
    }

    abort() {
        this.hasBeenAborted = true;
    }

    wasSuccessful(): boolean  {
        return true;
    }

    onSegmentLoaded(segment: P2PMediaSegment) {
        if (segment !== this.segment) {
            return;
        }

        if (this.hasBeenAborted) {
            return;
        }
    }

    onSegmentError(segment: P2PMediaSegment, err: Error) {
        if (segment !== this.segment) {
            return;
        }

        if (this.hasBeenAborted) {
            return;
        }
    }

    onSegmentAbort(segment: P2PMediaSegment) {
        if (segment !== this.segment) {
            return;
        }

        if (this.hasBeenAborted) {
            return;
        }

        this.hasBeenAborted = true;
    }
}

export class HlsAccessProxy {

    private downloader: IMediaDownloader;
    private mediaStreamConsumer: AdaptiveMediaStreamConsumer = null;
    private scheduler: Scheduler = new Scheduler(SCHEDULER_FRAMERATE);

    public constructor(loader: IMediaDownloader) {

        debug("created HLS access-proxy")

        this.downloader = loader;
    }

    public getResourceRequestMaker(swarmId: string): ResourceRequestMaker {
        return ((url: string, {byteRange}) => this.getResourceRequest(url, byteRange, swarmId));
    }

    public getResourceRequest(url: string, byteRange: ByteRange, swarmId: string): IResourceRequest {
        return new P2PMediaDownloaderRequest(url, byteRange, this.downloader, swarmId);
    }

    public setSource(url: string): void {

        debug(`processing playlist (parsing) for url: ${url}`);

        const m3u8 = new HlsM3u8File(url);

        m3u8.fetch().then(() => {
          m3u8.parse().then((adaptiveMediaPeriods: AdaptiveMediaPeriod[]) => {
                const media: AdaptiveMedia = adaptiveMediaPeriods[0].getDefaultMedia();

                media.refresh().then((media: AdaptiveMedia) => {

                    media.segments.forEach((segment: MediaSegment) => {
                        segment.setRequestMaker(this.getResourceRequestMaker(media.segmentIndexUri));
                    })

                    const consumer: AdaptiveMediaStreamConsumer =
                        new AdaptiveMediaStreamConsumer(media, this.scheduler, (segment: MediaSegment) => {
                            this._onSegmentBuffered(segment);
                        });

                    this.mediaStreamConsumer = consumer;

                    consumer.updateFetchTarget(5);
                })
            })
        });
    }

    private _onSegmentBuffered(segment: MediaSegment) {
        debug("segment buffered:", segment)
    }

    private _getSwarmIdForVariantPlaylist(playlistUrl: string): string {

        /*
        if (this.masterPlaylist) {
            // remove query param from master url
            const masterUrlNoQuery = this.masterPlaylist.url.split("?")[0];
            for (let i = 0; i < this.masterPlaylist.manifest.playlists.length; ++i) {
                // get variant playlist in manifest
                let url = this.masterPlaylist.manifest.playlists[i].uri;
                // resolve variant playlist URLs
                url = Utils.isAbsoluteUrl(url) ? url : this.masterPlaylist.baseUrl + url;
                // we use the `masterUrlNoQuery+V` as swarm ID
                if (url === playlistUrl) {
                    return `${masterUrlNoQuery}+V${i}`;
                }
            }
        }
        */

        return playlistUrl;
    }
}

