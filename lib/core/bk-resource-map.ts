/**
 * Data-type used for serialization into the resource-map for inter-peer communication to share
 * remote resource states. This is only used for mapping remote state. The local resource state
 * is represented by `BKResource` directly.
 */
export type BKResourceState = {
    bytesLoaded: number
    bytesTotal: number
}

export function createBKResourceState(bytesLoaded = 0, bytesTotal = NaN): BKResourceState {
    return {
        bytesLoaded,
        bytesTotal
    }
}

export function checkBKResourceStateLoaded(state: BKResourceState): boolean {
    return state.bytesLoaded > 0 && (state.bytesLoaded === state.bytesTotal);
}

export type BKResourceRemoteState = [string, BKResourceState];

export type BKResourceMapData = BKResourceRemoteState[];

// https://github.com/Microsoft/TypeScript/issues/10853#issuecomment-246175061
/**
 * @class Maps resources to their state (e.g bytes available) on a related peer. The mapping goes from
 * the original resource ID (eg CDN URI) to the state of the resource on the remote peer (see `BKResourceRemoteState`).
 *
 * This object is owned by a `Peer` that represents a remote peer candidate for requesting resource parts from.
 * It allows the local agent to know what resource parts are available on the remote peer.
 *
 * As trick is needed to be able to extend from native ES6 Map class using a factory paradigm
 * that does monkey-patching on the native prototype (ES5-like "extend")
 *
 * TODO: make this generic by adding a variable type to the template param (and put this in Objec-TS lib?)
 */
export class BKResourceMap extends Map<string, BKResourceState> {
    static create (array?: BKResourceRemoteState[]): BKResourceMap {
        var inst: any = new Map(array);
        inst['__proto__'] = BKResourceMap.prototype;
        return inst as BKResourceMap;
    }
}
