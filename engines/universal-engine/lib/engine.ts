import { EventEmitter } from "eventemitter3";

import {
    BK_IProxy,
    BKAccessProxy,
    Events,
    BKOptAccessProxySettings,
    BKResource,
    BKAccessProxySettings
} from "../../../core/lib";

import { HlsAccessProxy } from "./hls-access-proxy";

import * as Debug from "debug";
import { VirtualPlayhead } from "./virtual-playhead";
import { MonitorDomView } from "./monitor-dom-view";
import { BKAccessProxyEvents } from "../../../core/lib/bk-access-proxy";

const debug = Debug("bk:engine:universal:engine");

export class Engine /*extends EventEmitter*/ {

    public static isSupported(): boolean {
        return BKAccessProxy.isSupported();
    }

    private downloader: BK_IProxy;
    private sourceUrl: string | null = null;
    private hlsProxy: HlsAccessProxy;

    private playhead: VirtualPlayhead;

    private monitorDomView: MonitorDomView;

    public constructor(settings: BKOptAccessProxySettings) {
        //super();

        debug("created universal adaptive media p2p engine", settings);

        this.downloader = new BKAccessProxy(settings);

        this.monitorDomView = new MonitorDomView(this, 'root');

        this.hlsProxy = new HlsAccessProxy(this.downloader);

        // forward all events
        // TODO: -> to Utils
        /*
        Object.keys(Events)
            .map(eventKey => Events[eventKey as any])
            .forEach(event => this.downloader.on(event, (...args: any[]) => this.emit(event, ...args)));
        */

        const playhead: VirtualPlayhead = new VirtualPlayhead(() => {

            // TODO: add to monitor
            //console.log('media-engine virtual clock time:', playhead.getCurrentTime())

            this.hlsProxy.setFetchTarget(playhead.getCurrentTime());
        });

        this.playhead = playhead;

        playhead.play();
    }

    public getProxy(): BK_IProxy{ return this.downloader; }

    public destroy() {
        this.downloader.terminate();
    }

    public setSource(url: string) {
        if (this.sourceUrl) {
            throw new Error("Source URL already set");
        }

        this.sourceUrl = url;

        debug("set source", url)

        // FIXME: this is a hack, should only be used if running directly on a media-variant playlist (not master)
        this.downloader.setSwarmId(this.hlsProxy.getSwarmIdForVariantPlaylist(url));
    }

    public loadSource() {
        if (!this.sourceUrl) {
            throw new Error("Np source URL set");
        }

        this.hlsProxy.setSource(this.sourceUrl);
    }
}
