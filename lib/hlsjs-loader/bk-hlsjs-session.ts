import { BKAccessProxy, BK_IProxy } from "../core";
import { HlsjsLoader } from "./hlsjs-loader-iface";
import { BKHlsjsLoader } from "./bk-hlsjs-loader";

export class BKHlsjsSession {

    private _proxy: BKAccessProxy;

    constructor() {
        this._proxy = new BKAccessProxy();
    }

    getLoaderClass() {
        const proxy = this._proxy;
        return class Loader {
            constructor() {
                return new BKHlsjsLoader(proxy);
            }
        }
    }
}
