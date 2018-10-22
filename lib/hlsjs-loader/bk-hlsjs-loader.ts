import { HlsjsLoaderContext, HlsjsLoaderConfig, HlsjsLoaderCallbacks, HlsjsLoader } from "./hlsjs-loader-iface";
import { BK_IProxy } from "../core";

export class BKHlsjsLoader implements HlsjsLoader {
    constructor(
        private _proxy: BK_IProxy,
        private _onLoad: (context: HlsjsLoaderContext, config: HlsjsLoaderConfig, callbacks: HlsjsLoaderCallbacks) => void,
        private _onAbort: () => void
        ) {
    }

    abort() {
        this._onAbort();
    }

    load(context: HlsjsLoaderContext, config: HlsjsLoaderConfig, callbacks: HlsjsLoaderCallbacks) {
        this._onLoad(context, config, callbacks);
    }

    destroy() {
        this._proxy.terminate();
    }
}
