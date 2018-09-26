import { HlsjsLoaderContext, HlsjsLoaderConfig, HlsjsLoaderCallbacks, HlsjsLoader } from "./hlsjs-loader-iface";
import { BK_IProxy, BKResource, BKProxyEvents } from "../core";
import { ByteRange } from "../../ext-mod/emliri-es-libs/rialto/lib/byte-range";
import { utf8BytesToString } from "../../ext-mod/emliri-es-libs/rialto/lib/bytes-read-write";



export class BKHlsjsLoader implements HlsjsLoader {

    private _resourcesQueued: BKResource[] = [];

    constructor(private _proxy: BK_IProxy) {}

    abort() {
        this._resourcesQueued.forEach((resource) => {
            this._proxy.abort(resource);
        })
    }

    load(context: HlsjsLoaderContext, config: HlsjsLoaderConfig, callbacks: HlsjsLoaderCallbacks) {

        console.log('load:', context.url, context.responseType);

        let range: ByteRange = null;
        if (typeof context.rangeStart === 'number' && typeof context.rangeEnd === 'number') {
            range = new ByteRange(context.rangeStart, context.rangeEnd);
        }

        const trequest = 1000;
        const resource = new BKResource(context.url, range);

        this._resourcesQueued.push(resource);
        this._proxy.enqueue(resource);

        this._proxy.on(BKProxyEvents.ResourceLoaded, (res: BKResource) => {

            const i = this._resourcesQueued.findIndex((r) => r === res);
            this._resourcesQueued.splice(i, 1);

            const url = res.getUrl();

            let data: ArrayBuffer | string = res.data;

            if (url.endsWith('.vtt')) {
                data = utf8BytesToString(new Uint8Array(data));
                console.log('decoded VTT bytes to string:', data)
            }

            callbacks.onSuccess({url, data}, {
                trequest,
                retry: 0
            }, context, null);
        });

        this._proxy.on(BKProxyEvents.ResourceError, (res: BKResource, err: Error) => {
            callbacks.onError({code: 0, text: err.message}, context, null);
        });

        this._proxy.on(BKProxyEvents.ResourceAbort, (res: BKResource) => {
            console.log('Resource aborted');
            //callbacks.onTimeout()
        });
    }

    destroy() {
        this._proxy.terminate();
    }
}
