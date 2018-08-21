import { EventEmitter } from "eventemitter3";
import { LoaderInterface, HybridLoader, Events } from "../../../core/lib";
import { HlsAccessProxy } from "./hls-access-proxy";

import Utils from './utils';

import * as Debug from "debug";

const debug = Debug("p2pml:virtual:engine");

export class Engine extends EventEmitter {

    public static isSupported(): boolean {
        return HybridLoader.isSupported();
    }

    private readonly loader: LoaderInterface;
    private sourceUrl: string | null = null;

    readonly segmentManager: HlsAccessProxy;

    public constructor(settings: any = {}) {
        super();

        debug("created virtual engine", settings);

        this.loader = new HybridLoader(settings.loader);
        this.segmentManager = new HlsAccessProxy(this.loader);

        Object.keys(Events)
            .map(eventKey => Events[eventKey as any])
            .forEach(event => this.loader.on(event, (...args: any[]) => this.emit(event, ...args)));
    }

    public destroy() {
        this.loader.destroy();
    }

    public setSource(url: string) {
        if (this.sourceUrl) {
            throw new Error("Source URL already set");
        }

        this.sourceUrl = url;

        Utils.fetchContentAsText(url).then((data: string) => {
            debug(`loaded content from source url: ${url}`)
            this.segmentManager.processPlaylist(url, data);

            if (this.segmentManager.hasMasterPlaylist()) {
                this._checkForVariants();
            }

        }).catch((err) => {
            this.sourceUrl = null;
            console.error(`Failed loading source URL (${url}), reason:`, err);
        })
    }

    private _checkForVariants() {

        this.segmentManager.getVariantPlaylistUrls().forEach((url: string) => {
            Utils.fetchContentAsText(url).then((data: string) => {
                debug(`loaded content from variant media url: ${url}`)
                this.segmentManager.processPlaylist(url, data);
            }).catch((err) => {
                this.sourceUrl = null;
                console.error(`Failed loading variant media URL (${url}), reason:`, err);
            })
        })

    }

}
