import { HlsjsLoaderContext, HlsjsLoaderConfig, HlsjsLoaderCallbacks, HlsjsLoader } from "./hlsjs-loader-iface";
import { BK_IProxy, BKResource, BKProxyEvents } from "../core";
import { ByteRange } from "../../ext-mod/emliri-es-libs/rialto/lib/byte-range";
import { utf8BytesToString } from "../../ext-mod/emliri-es-libs/rialto/lib/bytes-read-write";

export class BKHlsjsLoader implements HlsjsLoader {

    private _resourcesQueued: BKResource[] = [];

    private _mapUrlToCallbacks: {[url: string]: HlsjsLoaderCallbacks} = {};
    private _mapUrlToContext: {[url: string]: HlsjsLoaderContext} = {};

    constructor(private _proxy: BK_IProxy) {

        console.error('Created BKHlsjsLoader');

        const trequest = 1000;

        this._proxy.on(BKProxyEvents.ResourceLoaded, (res: BKResource) => {

            console.warn('done loading:', res.uri);

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

            const response = res.getRequestResponse();

            let data: ArrayBuffer | string;
            if (url.endsWith('.vtt')) {
                data = response.getString();
                console.log('decoded VTT bytes to string:', data)
            } else {
                data = response.getArrayBuffer();
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
            //callbacks.onTimeout()
        });
    }

    abort() {
        this._resourcesQueued.forEach((resource) => {
            this._proxy.abort(resource);
        })
    }

    load(context: HlsjsLoaderContext, config: HlsjsLoaderConfig, callbacks: HlsjsLoaderCallbacks) {

        console.warn('load:', context.url, context.responseType);

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

    destroy() {
        console.error('Destroy BKHlsjsLoader')
        this._proxy.terminate();
    }
}
