import * as Debug from 'debug';

import { HlsM3u8File } from '../../ext-mod/emliri-es-libs/rialto/lib/hls-m3u8';
import { ResourceRequestMaker, IResourceRequest, ResourceRequestOptions } from '../../ext-mod/emliri-es-libs/rialto/lib/resource-request';
import { AdaptiveMediaStreamConsumer } from '../../ext-mod/emliri-es-libs/rialto/lib/adaptive-media-client';
import { AdaptiveMedia, AdaptiveMediaPeriod } from '../../ext-mod/emliri-es-libs/rialto/lib/adaptive-media';
import { MediaSegment } from '../../ext-mod/emliri-es-libs/rialto';
import { TimeInterval, TimeIntervalContainer } from '../../ext-mod/emliri-es-libs/rialto/lib/time-intervals';

import { BK_IProxy } from '../core';
import { BKResourceRequest } from '../core/bk-resource-request'; // TODO: move to core
import { getSwarmIdForVariantPlaylist } from '../core/bk-swarm-id';
import { StringlyTypedEventEmitter } from '../core/stringly-typed-event-emitter';

const debug = Debug('bk:engine:universal:hls-access-proxy');

export class HlsAccessProxy extends StringlyTypedEventEmitter<'buffered-range-change'> {

    private _bkProxy: BK_IProxy;
    private _mediaStreamConsumer: AdaptiveMediaStreamConsumer = null;

    public constructor(proxy: BK_IProxy) {
        super();

        debug('created HLS access-proxy');

        this._bkProxy = proxy;
    }

    public setSource(url: string): void {

        debug(`processing playlist (parsing) for url: ${url}`);

        this._processM3u8File(url);
    }

    public setFetchFloorCeiling(floor: number = 0, ceiling: number = Infinity) {
        if (!this._mediaStreamConsumer) {
            return;
        }

        this._mediaStreamConsumer.setFetchFloorCeiling(floor, ceiling);
    }

    public getBufferedRanges(): TimeIntervalContainer {
        if (!this._mediaStreamConsumer) {
            return new TimeIntervalContainer();
        }

        return this._mediaStreamConsumer.getBufferedRanges();
    }

    private _createResourceRequestMaker(swarmId: string): ResourceRequestMaker {
        //debug(`new ResourceRequestMaker for ${swarmId}`);
        return ((url: string, requestOpts: ResourceRequestOptions) =>
            this._createResourceRequest(swarmId, url, requestOpts));
    }

    private _createResourceRequest(swarmId: string, url: string, requestOpts: ResourceRequestOptions): IResourceRequest {
        return new BKResourceRequest(this._bkProxy, swarmId, url, requestOpts);
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

        media.refresh(true, () => { // called everytime we auto-refresh

            debug('setting request-makers on new segments', media.segments.length)

            media.segments.forEach((segment: MediaSegment) => {
                if (segment.hasCustomRequestMaker()) {
                    return;
                }
                debug('setting request-maker for:', segment.getUrl())
                const swarmId = getSwarmIdForVariantPlaylist(url);
                segment.setRequestMaker(this._createResourceRequestMaker(swarmId));
            });

        }).then((media: AdaptiveMedia) => { // called on first initial refresh

            this._mediaStreamConsumer
                = new AdaptiveMediaStreamConsumer(media, (segment: MediaSegment) => {
                    this._onSegmentBuffered(segment);
                });

        }).catch((err) => {
            debug('no adaptive media refresh:', err);
        });
    }

    private _onSegmentBuffered(segment: MediaSegment) {
        debug('segment buffered:', segment.getUrl());

        this.emit('buffered-range-change', this.getBufferedRanges());
    }
}

