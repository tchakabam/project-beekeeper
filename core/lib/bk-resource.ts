import { Resource } from '../../ext-mod/emliri-es-libs/rialto/lib/resource';

export type BKResourceMapData = Array<[string, BKResourceStatus]>;

export class BKResourceMap extends Map<string, BKResourceStatus> {
    static create (array?:any[]): BKResourceMap {
        var inst: any = new Map(array);
        inst['__proto__'] = BKResourceMap.prototype;
        return inst as BKResourceMap;
    }
}

export enum BKResourceStatus {
    Void = 'void',
    Loaded = 'loaded',
    LoadingViaP2p = 'loading_via_p2p',
    LoadingViaHttp = 'loading_via_http'
}

export class BKResource extends Resource {

    lastAccessedAt = 0;
    swarmId: string;
    status: BKResourceStatus = BKResourceStatus.Void;

    get id(): string { return this.uri; }
    get data(): ArrayBuffer { return this.buffer; }
}

