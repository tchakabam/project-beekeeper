import { PlaybackState } from './playback-state-machine';
export declare enum MediaPlayerAction {
    SEEK = "seek",
    PLAY = "play",
    PAUSE = "pause",
    SET_SOURCE = "set:source",
    SET_MUTED = "set:muted",
    SET_VOLUME = "set:volume"
}
export declare type MediaPlayerActionValue = (string | boolean | number);
export declare type MediaPlayerActionQueueItem = {
    action: MediaPlayerAction;
    value: MediaPlayerActionValue;
    timeoutMs?: number;
    callback: (ok: boolean, error?: Error) => void;
};
export declare class MediaElementController {
    private _mediaEl;
    private _actionQueue;
    private _execTimer;
    constructor(mediaEl: HTMLMediaElement);
    private _execSeek;
    private _execPause;
    private _execPlay;
    private _execSetSource;
    private _execSetVolume;
    execOneAction(): boolean;
    scheduleNextActionExec(): void;
    cancelNextActionExec(): void;
    enqueueAction(cmd: MediaPlayerActionQueueItem, unshift?: boolean): void;
    flushAllActions(): void;
    flushActions(action: MediaPlayerAction): void;
    do(action: MediaPlayerAction, value?: MediaPlayerActionValue, async?: boolean, timeoutMs?: number): Promise<MediaPlayerActionQueueItem>;
}
declare type MediaPlayerActionResult = MediaPlayerActionQueueItem;
export declare class MediaPlayer {
    private _mediaElement;
    private _mediaSession;
    private _mediaElementController;
    private _onStateChange;
    constructor(mediaElement: HTMLMediaElement, onStateChange?: () => void);
    readonly state: PlaybackState;
    readonly time: number;
    readonly duration: number;
    setSource(url: string): Promise<MediaPlayerActionResult>;
    setVolume(vol: number): Promise<MediaPlayerActionResult>;
    play(): Promise<MediaPlayerActionResult>;
    pause(): Promise<MediaPlayerActionResult>;
    seek(target: number, relative?: boolean): Promise<MediaPlayerActionResult>;
    private onPlaybackStateMachineTransitionCb_;
    private onMediaElementEventTranslatedCb_;
    private takeMediaElement_;
    /**
     * Reset a media element for re-usal
     */
    private resetMediaElement_;
}
export {};
