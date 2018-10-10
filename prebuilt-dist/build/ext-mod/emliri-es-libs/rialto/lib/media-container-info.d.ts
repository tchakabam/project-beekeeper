import { CloneableScaffold } from "./cloneable";
export declare type VideoInfo = {
    width: number;
    height: number;
};
export declare type AudioInfo = {
    language: string;
    channels: number;
};
export declare type TextInfo = {
    language: string;
};
export declare enum MediaTypeFlag {
    AUDIO = 1,
    VIDEO = 2,
    TEXT = 4
}
export declare type MediaTypeSet = Set<MediaTypeFlag>;
/**
 * Human-readable `MediaTypeFlag`
 * @param type
 */
export declare function getMediaTypeFlagName(type: MediaTypeFlag): string;
export declare class MediaContainerInfo extends CloneableScaffold<MediaContainerInfo> {
    containedTypes: Set<MediaTypeFlag>;
    containsMediaType(type: MediaTypeFlag): boolean;
    intersectsMediaTypeSet(mediaTypeSet: MediaTypeSet, indentical?: boolean): boolean;
    hasOneOf(mediaTypeSet: MediaTypeSet): boolean;
    hasAll(mediaTypeSet: MediaTypeSet): boolean;
}
export interface MediaContainer {
    mediaContainerInfo: MediaContainerInfo;
}
