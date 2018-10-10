import { Resource, ParseableResource } from './resource';
import { AdaptiveMediaPeriod, AdaptiveMedia } from './adaptive-media';
export declare enum HlsM3u8FileType {
    MASTER = "master",
    MEDIA = "media"
}
export declare enum HlsM3u8MediaPlaylistType {
    LIVE = "live",
    VOD = "vod"
}
export declare class HlsM3u8File extends Resource implements ParseableResource<AdaptiveMediaPeriod[]> {
    private _m3u8ParserResult;
    private _parsed;
    private _fileType;
    private _hlsMediaPlaylists;
    private _periods;
    private _adaptiveMediaSet;
    constructor(uri: any, fileType?: HlsM3u8FileType, baseUri?: string);
    hasBeenParsed(): boolean;
    parse(): Promise<AdaptiveMediaPeriod[]>;
    private _processMasterPlaylist;
    private _processMediaVariantPlaylist;
    fetch(): Promise<Resource>;
    getM3u8FileType(): HlsM3u8FileType;
    getM3u8ParserResult(): any;
}
export declare class HlsM3u8MediaPlaylist extends Resource implements ParseableResource<AdaptiveMedia> {
    private _file;
    constructor(m3u8File: HlsM3u8File);
    hasBeenParsed(): boolean;
    parse(): Promise<AdaptiveMedia>;
    fetch(): Promise<Resource>;
}
