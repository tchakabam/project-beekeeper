import { Resource } from '../../ext-mod/emliri-es-libs/rialto/lib/resource';
import { ByteRange } from '../../ext-mod/emliri-es-libs/rialto/lib/byte-range';

export enum BKResourceTransportMode {
    UNKNOWN = 'unknown',
    P2P = 'p2p',
    HTTP = 'http'
}

export class BKResource extends Resource {

    constructor(uri: string, byteRange?: ByteRange) {
        super(uri, byteRange);
    }

    /**
     * (Bittorrent) P2P Swarm-ID this resource is to be found on
     */
    swarmId: string = null;

    /**
     * Remote peer id this resource part is on
     */
    peerId: string = null;

    /**
     *
     */
    peerShortName: string = null;

    /**
     * Caching timestamp
     */
    lastAccessedAt = 0;

    /**
     * How we request this resource part
     */
    transportMode: BKResourceTransportMode = BKResourceTransportMode.UNKNOWN;

    /**
     * compatibility layer / props-mapping between BK and the generic base-class
     *
     * BK resource ID -> URI
     */
    get id(): string { return this.uri; }

    /**
     * data -> buffered resource data
     */
    get data(): ArrayBuffer { return this.buffer; }
}

