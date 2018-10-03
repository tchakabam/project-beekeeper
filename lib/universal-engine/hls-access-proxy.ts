import * as Debug from 'debug';
import { createHash } from 'crypto';

import { BK_IProxy } from '../core';

import { Scheduler } from '../../ext-mod/emliri-es-libs/objec-ts/lib/scheduler';
import { HlsM3u8File } from '../../ext-mod/emliri-es-libs/rialto/lib/hls-m3u8';
import { ResourceRequestMaker, IResourceRequest, ResourceRequestOptions } from '../../ext-mod/emliri-es-libs/rialto/lib/resource-request';
import { AdaptiveMediaStreamConsumer } from '../../ext-mod/emliri-es-libs/rialto/lib/adaptive-media-client';
import { AdaptiveMedia, AdaptiveMediaPeriod } from '../../ext-mod/emliri-es-libs/rialto/lib/adaptive-media';
import { MediaSegment } from '../../ext-mod/emliri-es-libs/rialto';

import { BKResourceRequest } from '../core/bk-resource-request'; // TODO: move to core
import { getSwarmIdForVariantPlaylist } from '../core/bk-swarm-id';
import { TimeInterval } from '../../ext-mod/emliri-es-libs/rialto/lib/time-intervals';

const debug = Debug('bk:engine:universal:hls-access-proxy');

export class HlsAccessProxy {

    private downloader: BK_IProxy;
    private mediaStreamConsumer: AdaptiveMediaStreamConsumer = null;

    public constructor(loader: BK_IProxy) {

        debug('created HLS access-proxy');

        this.downloader = loader;
    }

    public setSource(url: string): void {

        debug(`processing playlist (parsing) for url: ${url}`);

        this._processM3u8File(url);
    }

    public setFetchTarget(time: number) {
        if (this.mediaStreamConsumer && time > 0) {
            this.mediaStreamConsumer.setFetchTargetRange(new TimeInterval(0, time));
        }
    }

    private _createResourceRequestMaker(swarmId: string): ResourceRequestMaker {
        debug(`new ResourceRequestMaker for ${swarmId}`);
        return ((url: string, requestOpts: ResourceRequestOptions) =>
            this._createResourceRequest(swarmId, url, requestOpts));
    }

    private _createResourceRequest(swarmId: string, url: string, requestOpts: ResourceRequestOptions): IResourceRequest {
        return new BKResourceRequest(this.downloader, swarmId, url, requestOpts);
    }

    private _processM3u8File(url: string) {
        const m3u8 = new HlsM3u8File(url);

        m3u8.fetch().then(() => {
            m3u8.parse().then((adaptiveMediaPeriods: AdaptiveMediaPeriod[]) => {
                this._onAdaptiveMediaPeriodsParsed(url, adaptiveMediaPeriods);
            });
        });
    }

    private _onAdaptiveMediaPeriodsParsed(url: string, adaptiveMediaPeriods: AdaptiveMediaPeriod[]) {
        // may get the first media of the first set in this period
        const media: AdaptiveMedia = adaptiveMediaPeriods[0].getDefaultSet().getDefaultMedia();

        media.refresh(true).then((media: AdaptiveMedia) => {

            media.segments.forEach((segment: MediaSegment) => {
                const swarmId = getSwarmIdForVariantPlaylist(url);
                segment.setRequestMaker(this._createResourceRequestMaker(swarmId));
            });

            this.mediaStreamConsumer
                = new AdaptiveMediaStreamConsumer(media, (segment: MediaSegment) => {
                    this._onSegmentBuffered(segment);
                });

        }).catch((err) => {
            debug('no adaptive media refresh:', err);
        });

    }

    private _onSegmentBuffered(segment: MediaSegment) {
        debug('segment buffered:', segment.getUrl());
    }
}

