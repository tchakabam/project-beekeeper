import { BKAccessProxy, BK_IProxy, BKResource, BKProxyEvents } from "../core";
import { HlsjsLoader, HlsjsLoaderCallbacks, HlsjsLoaderContext, HlsjsLoaderConfig } from "./hlsjs-loader-iface";
import { BKHlsjsLoader } from "./bk-hlsjs-loader";
import { ByteRange } from "../../ext-mod/emliri-es-libs/rialto/lib/byte-range";
import { utf8BytesToString } from "../../ext-mod/emliri-es-libs/rialto/lib/bytes-read-write";
import { getSwarmIdForVariantPlaylist } from "../core/bk-swarm-id";

export class BKHlsjsSession {

    private _proxy: BKAccessProxy = null;
    private _resourcesQueued: BKResource[] = [];

    private _mapUrlToCallbacks: {[url: string]: HlsjsLoaderCallbacks} = {};
    private _mapUrlToContext: {[url: string]: HlsjsLoaderContext} = {};

    constructor(url) {
        this._proxy = new BKAccessProxy();

        this._proxy.setSwarmId(getSwarmIdForVariantPlaylist(url));

        const trequest = 1000;

        this._proxy.on(BKProxyEvents.ResourceFetched, (res: BKResource) => {

            const callbacks = this._mapUrlToCallbacks[res.uri];
            const context = this._mapUrlToContext[res.uri];

            if (!context && !callbacks) {
                return;
            }

            if (!context || !callbacks) {
                throw new Error('Assertion failed, loader-mapping inconsistency for resource: ' + res.uri);
            }

            const i = this._resourcesQueued.findIndex((r) => r === res);
            this._resourcesQueued.splice(i, 1);

            const url = res.getUrl();

            let data: ArrayBuffer | string;
            let response;

            // FIXME
            try {
                response = res.getRequestResponse();
                if (url.endsWith('.vtt')) {
                    data = response.getString();
                } else {
                    data = response.getArrayBuffer().slice(0);
                }
            } catch(err) { // PeerAgent doesn't support Rialot ResourceRequest iface fully so we have a workaround
                if (url.endsWith('.vtt')) {
                    data = utf8BytesToString(new Uint8Array(res.buffer))
                } else {
                    data = res.buffer.slice(0);
                }
            }

            callbacks.onSuccess({url, data}, {
                trequest,
                retry: 0
            }, context, null);

            delete this._mapUrlToCallbacks[res.uri];
            delete this._mapUrlToContext[res.uri];
        });

        this._proxy.on(BKProxyEvents.ResourceError, (res: BKResource, err: Error) => {
            console.error('Error loading resource:', err)

            const callbacks = this._mapUrlToCallbacks[res.uri];
            const context = this._mapUrlToContext[res.uri];
            callbacks.onError({code: 0, text: 'BKHlsjLoader error' + err}, context, null);
        });

        this._proxy.on(BKProxyEvents.ResourceAbort, (res: BKResource) => {
            console.log('Resource aborted');
            const callbacks = this._mapUrlToCallbacks[res.uri];
            const context = this._mapUrlToContext[res.uri];
            callbacks.onError({code: 0, text: 'BKHlsjLoader aborted: ' + res.uri}, context, null);
        });
    }

    getLoaderClass() {
        const self = this;
        const proxy = this._proxy;
        return class Loader {
            constructor() {
                const loader = new BKHlsjsLoader(proxy, self.onLoad.bind(self), self.onAbort.bind(self));
                return loader;
            }
        }
    }

    onLoad(context: HlsjsLoaderContext, config: HlsjsLoaderConfig, callbacks: HlsjsLoaderCallbacks) {
        let range: ByteRange = null;
        if (typeof context.rangeStart === 'number' && typeof context.rangeEnd === 'number') {
            range = new ByteRange(context.rangeStart, context.rangeEnd);
        }

        const resource = new BKResource(context.url, range);

        this._resourcesQueued.push(resource);
        this._mapUrlToCallbacks[resource.uri] = callbacks;
        this._mapUrlToContext[resource.uri] = context;
        this._proxy.enqueue(resource);
    }

    onAbort() {
        this._resourcesQueued.forEach((resource) => {
            this._proxy.abort(resource);
        })
    }
}
