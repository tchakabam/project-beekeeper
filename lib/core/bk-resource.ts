import { Resource } from '../../ext-mod/emliri-es-libs/rialto/lib/resource';
import { BKPeer } from './peer';

export type BKResourceMapData = Array<[string, BKResourceStatus]>;

// https://github.com/Microsoft/TypeScript/issues/10853#issuecomment-246175061
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

export enum BKResourceTransportMode {
    UNKNOWN = 'unknown',
    P2P = 'p2p',
    HTTP = 'http'
}

export class BKResource extends Resource {

    lastAccessedAt = 0;
    swarmId: string;
    status: BKResourceStatus = BKResourceStatus.Void;
    transportMode: BKResourceTransportMode = BKResourceTransportMode.UNKNOWN;
    peerId: string;
    peerShortName: string;

    get id(): string { return this.uri; }
    get data(): ArrayBuffer { return this.buffer; }
}

