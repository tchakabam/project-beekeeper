export declare type MediaCacheResource = {
    uri: string;
    createdAt: number;
    accessedAt: number;
    data: ArrayBuffer;
};
export declare const mediaCacheInstance: {
    allowUpdates: boolean;
    errorOnOverflow: boolean;
    get: (uri: string, onlyData?: boolean) => ArrayBuffer | MediaCacheResource;
    put: (uri: string, data: ArrayBuffer) => Object;
    purgeByUri: (uri: string) => boolean;
    purgeAll: () => void;
    purgeNotAccessedSince: (timeMillisSince: number) => void;
    purgeCreatedBefore: (timestamp: number) => void;
    purgeOldest: (type?: string, count?: number) => void;
    reduce: (reducer: (accu: any, resource: MediaCacheResource) => any, accuInit?: number) => string | number;
    sumDataProperty: (field: string) => string | number;
    countBytes: () => string | number;
};
export declare const getInfo: () => {
    bytesRead: number;
    bytesWritten: number;
    hits: number;
    misses: number;
};
