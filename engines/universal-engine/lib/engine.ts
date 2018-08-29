import { EventEmitter } from "eventemitter3";
import { IMediaDownloader, MediaAccessProxy, Events, OptMediaProxyAccessSettings } from "../../../core/lib";
import { HlsAccessProxy } from "./hls-access-proxy";

import * as Debug from "debug";

const debug = Debug("p2pml:virtual:engine");

export class Engine extends EventEmitter {

    public static isSupported(): boolean {
        return MediaAccessProxy.isSupported();
    }

    private downloader: IMediaDownloader;
    private sourceUrl: string | null = null;

    private hlsProxy: HlsAccessProxy;

    public constructor(settings: OptMediaProxyAccessSettings) {
        super();

        debug("created virtual engine", settings);

        this.downloader = new MediaAccessProxy(settings);
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
