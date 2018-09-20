import {
    BK_IProxy,
    BKAccessProxy,
    BKOptAccessProxySettings,
} from "../../../core/lib";

import { HlsAccessProxy } from "./hls-access-proxy";

import * as Debug from "debug";
import { VirtualPlayhead } from "./virtual-playhead";
import { MonitorDomView } from "./monitor-dom-view";

const debug = Debug("bk:engine:universal:engine");

export class Engine {

    public static isSupported(): boolean {
        return BKAccessProxy.isSupported();
    }

    private _proxy: BK_IProxy;
    private _sourceUrl: string | null = null;
    private _hlsProxy: HlsAccessProxy;
    private _playhead: VirtualPlayhead;
    private _monitorDomView: MonitorDomView;

    public constructor(settings: BKOptAccessProxySettings = {}) {
        //super();

        debug("created universal adaptive media p2p engine", settings);

        /**
         * Access proxy for HTTP resources
         */
        this._proxy = new BKAccessProxy(settings);

        /**
         * Accces proxy for HLS media (uses HTTP proxy)
         */
        this._hlsProxy = new HlsAccessProxy(this._proxy);

        /**
         * VirtualPlayhead clock control
         */
        this._playhead = new VirtualPlayhead(() => {

            // TODO: add to monitor
            //console.log('media-engine virtual clock time:', playhead.getCurrentTime())

            this._hlsProxy.setFetchTarget(this._playhead.getCurrentTime());
        });

        /**
         * Monitoring view
         */
        this._monitorDomView = !global ? new MonitorDomView(this, 'root') : null
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
            throw new Error("Source URL already set");
        }

        this._sourceUrl = url;

        debug("set source", url)

        // FIXME: this is a hack, should only be used if running directly on a media-variant playlist (not master)
        this._proxy.setSwarmId(this._hlsProxy.getSwarmIdForVariantPlaylist(url));
    }

    public start() {
        if (!this._sourceUrl) {
            throw new Error("No source URL set");
        }

        this._hlsProxy.setSource(this._sourceUrl);
    }
 }
