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
import { P2PDownloaderQueue } from "./p2p-downloader-queue";

const debug = Debug("p2pml:universal:engine");

export class Engine extends EventEmitter {

    public static isSupported(): boolean {
        return BKAccessProxy.isSupported();
    }

    private downloader: BK_IProxy;
    private sourceUrl: string | null = null;
    private hlsProxy: HlsAccessProxy;

    public constructor(settings: BKOptAccessProxySettings) {
        super();

        debug("created universal adaptive media p2p engine", settings);

        this.downloader = new P2PDownloaderQueue(new BKAccessProxy(settings));
        this.hlsProxy = new HlsAccessProxy(this.downloader);

        // forward all events
        // to Utils
        Object.keys(Events)
            .map(eventKey => Events[eventKey as any])
            .forEach(event => this.downloader.on(event, (...args: any[]) => this.emit(event, ...args)));
    }

    public destroy() {
        this.downloader.destroy();
    }

    public setSource(url: string) {
        if (this.sourceUrl) {
            throw new Error("Source URL already set");
        }

        this.sourceUrl = url;
        this.hlsProxy.setSource(url);
    }
}
