import * as Debug from "debug";
import { createHash } from "crypto"

import { BK_IProxy } from "../../../core/lib";

import { Scheduler } from "../../../ext-mod/emliri-es-libs/objec-ts/lib/scheduler";
import { HlsM3u8File } from "../../../ext-mod/emliri-es-libs/rialto/lib/hls-m3u8";
import { ResourceRequestMaker, IResourceRequest, ResourceRequestOptions } from "../../../ext-mod/emliri-es-libs/rialto/lib/resource-request";
import { AdaptiveMediaStreamConsumer } from "../../../ext-mod/emliri-es-libs/rialto/lib/adaptive-media-client"
import { AdaptiveMedia, AdaptiveMediaPeriod } from "../../../ext-mod/emliri-es-libs/rialto/lib/adaptive-media";
import { MediaSegment } from "../../../ext-mod/emliri-es-libs/rialto";

import { P2PResourceRequest } from "./p2p-resource-request";

const SWARM_URN_PREFIX = "urn:livepeer:beekeeper:bittorrent:swarm-id";

const SCHEDULER_FRAMERATE: number = 1;

const debug = Debug("bk:engine:universal:hls-access-proxy");

export class HlsAccessProxy {

    private downloader: BK_IProxy;
    private mediaStreamConsumer: AdaptiveMediaStreamConsumer = null;
    private scheduler: Scheduler = new Scheduler(SCHEDULER_FRAMERATE);

    private _swarmIdCache: {[url: string]: string} = {};

    public constructor(loader: BK_IProxy) {

        debug("created HLS access-proxy")

        this.downloader = loader;
    }

    public setSource(url: string): void {

        debug(`processing playlist (parsing) for url: ${url}`);

        this._processM3u8File(url);
    }

    public setFetchTarget(time: number) {
        if (this.mediaStreamConsumer) {
            this.mediaStreamConsumer.updateFetchTarget(time);
        }
    }

    public getSwarmIdForVariantPlaylist(manifestUrl: string): string {
        if (this._swarmIdCache[manifestUrl]) {
            debug(`swarm-ID cache hit: ${this._swarmIdCache[manifestUrl]}`);
            return this._swarmIdCache[manifestUrl];
        }

        debug(`creating swarm ID for manifest URL: ${manifestUrl}`);
        const swarmId = SWARM_URN_PREFIX + ":" + createHash("sha1").update(manifestUrl).digest("hex");
        debug(`created swarm ID: ${swarmId}`);
        this._swarmIdCache[manifestUrl] = swarmId;
        return swarmId;
    }

    private _createResourceRequestMaker(swarmId: string): ResourceRequestMaker {
        debug(`new ResourceRequestMaker for ${swarmId}`)
        return ((url: string, requestOpts: ResourceRequestOptions) => this._createResourceRequest(swarmId, url, requestOpts));
    }

    private _createResourceRequest(swarmId: string, url: string, requestOpts: ResourceRequestOptions): IResourceRequest {
        return new P2PResourceRequest(this.downloader, swarmId, url, requestOpts);
    }

    private _processM3u8File(url: string) {
        const m3u8 = new HlsM3u8File(url);

        m3u8.fetch().then(() => {
          m3u8.parse().then((adaptiveMediaPeriods: AdaptiveMediaPeriod[]) => {
                this._onAdaptiveMediaPeriodsParsed(url, adaptiveMediaPeriods);
            })
        });
    }

    private _onAdaptiveMediaPeriodsParsed(url: string, adaptiveMediaPeriods: AdaptiveMediaPeriod[]) {
        // may get the first media of the first set in this period
        const media: AdaptiveMedia = adaptiveMediaPeriods[0].getDefaultMedia();

        media.refresh().then((media: AdaptiveMedia) => {

            media.segments.forEach((segment: MediaSegment) => {

                //const swarmId = this._getSwarmIdForVariantPlaylist(media.getUrl());

                const swarmId = this.getSwarmIdForVariantPlaylist(url);

                segment.setRequestMaker(this._createResourceRequestMaker(swarmId));
            })

            const consumer: AdaptiveMediaStreamConsumer =
                new AdaptiveMediaStreamConsumer(media, this.scheduler, (segment: MediaSegment) => {
                    this._onSegmentBuffered(segment);
                });

            this.mediaStreamConsumer = consumer;

            consumer.maxConcurrentFetchInit = Infinity;
            //consumer.updateFetchTarget(5);
        })
    }

    private _onSegmentBuffered(segment: MediaSegment) {
        debug("segment buffered:", segment)
    }
}

