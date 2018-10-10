import { HlsjsLoaderContext, HlsjsLoaderConfig, HlsjsLoaderCallbacks, HlsjsLoader } from "./hlsjs-loader-iface";
import { BK_IProxy } from "../core";
export declare class BKHlsjsLoader implements HlsjsLoader {
    private _proxy;
    private _onLoad;
    private _onAbort;
    constructor(_proxy: BK_IProxy, _onLoad: (context: HlsjsLoaderContext, config: HlsjsLoaderConfig, callbacks: HlsjsLoaderCallbacks) => void, _onAbort: () => void);
    abort(): void;
    load(context: HlsjsLoaderContext, config: HlsjsLoaderConfig, callbacks: HlsjsLoaderCallbacks): void;
    destroy(): void;
}
