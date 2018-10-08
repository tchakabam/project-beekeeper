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

const FETCH_TARGET_PLAYHEAD_LOOK_AHEAD = 10;

export class Engine {

    public static isSupported(): boolean {
        return BKAccessProxy.isSupported();
    }

    private _proxy: BK_IProxy;
    private _sourceUrl: string | null = null;
    private _hlsProxy: HlsAccessProxy;
    private _playhead: VirtualPlayhead;
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
            this._onBufferedRangeChange();
        });

        /**
         * VirtualPlayhead clock control
         */
        this._playhead = new VirtualPlayhead(() => {

            // TODO: add to monitor
            //console.log('media-engine virtual clock time:', playhead.getCurrentTime())

            //this._hlsProxy.setFetchFloorCeiling(0, this._playhead.getCurrentTime() + FETCH_TARGET_PLAYHEAD_LOOK_AHEAD);

            this._hlsProxy.setFetchFloorCeiling(-30);
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

    public setNetemPeerMaxKbps(kbpsMaxBw: number) {
        this._proxy.getPeerConnections().forEach((peer) => {
            peer.getTransportInterface().setMaxBandwidthBps(1000 * kbpsMaxBw);
        })
    }

    private _onBufferedRangeChange() {
        this._playhead.setBufferedRanges(this._hlsProxy.getBufferedRanges());
    }
}
