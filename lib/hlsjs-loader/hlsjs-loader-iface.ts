export type HlsjsLoaderStats = {
    aborted?: boolean,
    trequest: number,
    tfirst?: number,
    tload?: number,
    retry: number, // no of retries
    loaded?: number // bytes
    total?: number
}

export type HlsjsLoaderResponse = {
    url: string,
    data: ArrayBuffer | string
  }

export type HlsjsLoaderProgressCb = (
    stats: HlsjsLoaderStats,
    context: HlsjsLoaderContext,
    xhr: XMLHttpRequest) => void

export type HlsjsLoaderTimeoutCb = (
    stats: HlsjsLoaderStats,
    context: HlsjsLoaderContext,
    xhr: XMLHttpRequest) => void

export type HlsjsLoaderErrorCb = (
    error: {code: number, text: string},
    context: HlsjsLoaderContext,
    xhr: XMLHttpRequest) => void

export type HlsjsLoaderSuccessCb = (
    response: HlsjsLoaderResponse,
    stats: HlsjsLoaderStats,
    context: HlsjsLoaderContext,
    xhr: XMLHttpRequest) => void

export type HlsjsLoaderCallbacks = {
    onProgress?: HlsjsLoaderProgressCb,
    onSuccess: HlsjsLoaderSuccessCb,
    onTimeout: HlsjsLoaderTimeoutCb,
    onError: HlsjsLoaderErrorCb
}

export type HlsjsLoaderContext = {
    id: number,
    url: string,
    rangeStart?: number,
    rangeEnd?: number,
    responseType: XMLHttpRequestResponseType,
    progressData: boolean
}

export type HlsjsLoaderConfig = {
    retryDelay: number
    maxRetryDelay: number
}

export interface HlsjsLoader {
    abort();

    load(context: HlsjsLoaderContext, config: HlsjsLoaderConfig, callbacks: HlsjsLoaderCallbacks);
}
