import { HlsjsLoaderCallbacks, HlsjsLoaderContext, HlsjsLoaderConfig } from "./hlsjs-loader-iface";
export declare class BKHlsjsSession {
    private _proxy;
    private _monitorView;
    private _resourcesQueued;
    private _mapUrlToCallbacks;
    private _mapUrlToContext;
    constructor(url: any);
    getLoaderClass(): {
        new (): {};
    };
    onLoad(context: HlsjsLoaderContext, config: HlsjsLoaderConfig, callbacks: HlsjsLoaderCallbacks): void;
    onAbort(): void;
}
