export type MediaSegmentsMapData = Array<[string, MediaSegmentStatus]>;

export class MediaSegmentsMap extends Map<string, MediaSegmentStatus> {
    static create (array?:any[]): MediaSegmentsMap {
        var inst: any = new Map(array);
        inst['__proto__'] = MediaSegmentsMap.prototype;
        return inst as MediaSegmentsMap;
    }
}

export enum MediaSegmentStatus {
    Loaded = "loaded",
    LoadingByHttp = "loading_by_http"
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
