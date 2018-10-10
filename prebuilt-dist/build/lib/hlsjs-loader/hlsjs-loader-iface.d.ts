export declare type HlsjsLoaderStats = {
    aborted?: boolean;
    trequest: number;
    tfirst?: number;
    tload?: number;
    retry: number;
    loaded?: number;
    total?: number;
};
export declare type HlsjsLoaderResponse = {
    url: string;
    data: ArrayBuffer | string;
};
export declare type HlsjsLoaderProgressCb = (stats: HlsjsLoaderStats, context: HlsjsLoaderContext, xhr: XMLHttpRequest) => void;
export declare type HlsjsLoaderTimeoutCb = (stats: HlsjsLoaderStats, context: HlsjsLoaderContext, xhr: XMLHttpRequest) => void;
export declare type HlsjsLoaderErrorCb = (error: {
    code: number;
    text: string;
}, context: HlsjsLoaderContext, xhr: XMLHttpRequest) => void;
export declare type HlsjsLoaderSuccessCb = (response: HlsjsLoaderResponse, stats: HlsjsLoaderStats, context: HlsjsLoaderContext, xhr: XMLHttpRequest) => void;
export declare type HlsjsLoaderCallbacks = {
    onProgress?: HlsjsLoaderProgressCb;
    onSuccess: HlsjsLoaderSuccessCb;
    onTimeout: HlsjsLoaderTimeoutCb;
    onError: HlsjsLoaderErrorCb;
};
export declare type HlsjsLoaderContext = {
    id: number;
    url: string;
    rangeStart?: number;
    rangeEnd?: number;
    responseType: XMLHttpRequestResponseType;
    progressData: boolean;
};
export declare type HlsjsLoaderConfig = {
    retryDelay: number;
    maxRetryDelay: number;
};
export interface HlsjsLoader {
    abort(): any;
    load(context: HlsjsLoaderContext, config: HlsjsLoaderConfig, callbacks: HlsjsLoaderCallbacks): any;
}
