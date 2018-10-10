import { Resource } from '../../ext-mod/emliri-es-libs/rialto/lib/resource';
export declare type BKResourceMapData = Array<[string, BKResourceStatus]>;
export declare class BKResourceMap extends Map<string, BKResourceStatus> {
    static create(array?: any[]): BKResourceMap;
}
export declare enum BKResourceStatus {
    Void = "void",
    Loaded = "loaded",
    LoadingViaP2p = "loading_via_p2p",
    LoadingViaHttp = "loading_via_http"
}
export declare class BKResource extends Resource {
    lastAccessedAt: number;
    swarmId: string;
    status: BKResourceStatus;
    readonly id: string;
    readonly data: ArrayBuffer;
}
