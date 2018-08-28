export type MediaSegmentsMapData = Array<[string, MediaSegmentStatus]>;

export class MediaSegmentsMap extends Map<string, MediaSegmentStatus> {
    static create (array?:any[]): MediaSegmentsMap {
        var inst: any = new Map(array);
        inst['__proto__'] = MediaSegmentsMap.prototype;
        return inst as MediaSegmentsMap;
    }
}

export enum MediaSegmentStatus {
    Void = "void",
    Loaded = "loaded",
    LoadingViaP2p = "loading_via_p2p",
    LoadingViaHttp = "loading_via_http"
}

export class MediaSegment {
    public constructor(
        readonly id: string,
        readonly url: string,
        readonly range: string | undefined,
        readonly priority = 0,
        readonly data: ArrayBuffer | undefined = undefined,
        readonly downloadSpeed = 0
    ) {}
}

export class StoredMediaSegment extends MediaSegment {
    public lastAccessed = 0;
}

