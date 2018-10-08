import {
    BK_IProxy,
    BKAccessProxy,
    BKOptAccessProxySettings,
} from '../core';

import { HlsAccessProxy } from './hls-access-proxy';

import * as Debug from 'debug';
import { VirtualPlayhead } from './virtual-playhead';
import { BKResourceTransferMonitorDomView } from '../core/bk-resource-tx-monitor';
import { getSwarmIdForVariantPlaylist } from '../core/bk-swarm-id';

const debug = Debug('bk:engine:universal:engine');

export class Engine {

    public static isSupported(): boolean {
        return BKAccessProxy.isSupported();
    }

    private _proxy: BK_IProxy;
    private _sourceUrl: string | null = null;
    private _hlsProxy: HlsAccessProxy;
    private _playhead: VirtualPlayhead;
    private _gotFirstBufferedRange: boolean = false;
    private _monitorDomView: BKResourceTransferMonitorDomView = null;

    public constructor(settings: BKOptAccessProxySettings = {}) {
        //super();

        debug('created universal adaptive media p2p engine', settings);

        /**
         * Access proxy for HTTP resources
         */
        this._proxy = new BKAccessProxy(settings);

        /**
         * Accces proxy for HLS media (uses HTTP proxy)
         */
        this._hlsProxy = new HlsAccessProxy(this._proxy);

        this._hlsProxy.on('buffered-range-change', () => {
            this._playhead.setBufferedRanges(this._hlsProxy.getBufferedRanges());

            if (!this._gotFirstBufferedRange) {
                const earliestRange = this._hlsProxy.getBufferedRanges().getEarliestRange();
                if (earliestRange) {

                    this._playhead.setCurrentTime(earliestRange.start)
                }
            }

            this._gotFirstBufferedRange = true;

        });

        /**
         * VirtualPlayhead clock control
         */
        this._playhead = new VirtualPlayhead(() => {

            // TODO: add to monitor
            //console.log('media-engine virtual clock time:', playhead.getCurrentTime())

            this._hlsProxy.updateFetchTargetRange(this._playhead.getCurrentTime());
        });

        /**
         * Monitoring view
         */
        this._monitorDomView = window && window.document ?
            new BKResourceTransferMonitorDomView(this.getProxy(), 'root') : null;
    }

    public getProxy(): BK_IProxy{
        return this._proxy;
    }

    public getPlayhead(): VirtualPlayhead {
        return this._playhead;
    }

    public getPeerId(): string {
        return this._proxy.getPeerId();
    }

    public getSwarmId(): string {
        return this._proxy.getSwarmId();
    }

    public destroy() {
        this._proxy.terminate();
    }

    public setSource(url: string) {
        if (this._sourceUrl) {
            throw new Error('Source URL already set');
        }

        this._sourceUrl = url;

        debug('set source', url);

        // FIXME: this is a hack, should only be used if running directly on a media-variant playlist (not master)
        this._proxy.setSwarmId(getSwarmIdForVariantPlaylist(url));
    }

    public start() {
        if (!this._sourceUrl) {
            throw new Error('No source URL set');
        }

        this._hlsProxy.setSource(this._sourceUrl);
    }

    public setMaxLiveDelaySeconds(maxLiveDelaySeconds: number) {
        this._hlsProxy.liveDelaySeconds = maxLiveDelaySeconds;
    }

    public setMaxPlayheadLookaheadSeconds(maxPlayheadLookaheadSeconds: number) {
        this._hlsProxy.playheadLookaheadSeconds = maxPlayheadLookaheadSeconds;
    }

    public setNetemPeerMaxKbps(kbpsMaxBw: number) {
        this._proxy.getPeerConnections().forEach((peer) => {
            peer.getTransportInterface().setMaxBandwidthBps(1000 * kbpsMaxBw);
        })
    }

}
