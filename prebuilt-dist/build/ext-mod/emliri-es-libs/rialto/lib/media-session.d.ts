import { PlaybackState, PlaybackStateMachineTransitionReasons } from './playback-state-machine';
import { MediaElement } from './media-element-observer';
export declare type MediaSessionHistoryItem = {
    state: string;
    reason: string;
    logText: string;
    time: Date;
};
export declare type MediaEventTranslationCallback = (MediaSession: any, MediaEventReasons: any) => void;
export declare type PlaybackStateMachineTransitionCallback = (MediaSession: any, PlaybackStateMachineTransitionReasons: any) => void;
export declare enum MediaElementSubclass {
    AUDIO = "audio",
    VIDEO = "video"
}
export declare class MediaSession {
    static createDOMMediaElement(subclass: MediaElementSubclass): HTMLAudioElement | HTMLVideoElement;
    private onMediaElementEventTranslatedCb_;
    private onPlaybackStateMachineTransitionCb_;
    private playbackStateMachine_;
    private mediaElObserver_;
    private _previousState;
    private _currentState;
    private _lastClockUpdateTs;
    private _clockUpdateTimeout;
    private _seeking;
    private _stateChangeHistory;
    private _eventHistory;
    private _sessionClockData;
    constructor(iHtml5MediaElement: MediaElement, onMediaElementEventTranslatedCb: MediaEventTranslationCallback, onPlaybackStateMachineTransitionCb: PlaybackStateMachineTransitionCallback);
    dispose(): void;
    readonly mediaPlaybackState: PlaybackState;
    readonly history: MediaSessionHistoryItem[];
    readonly clock: {
        time: number;
        frame: number;
        updateEventCount: number;
    };
    readonly mediaDuration: number;
    readonly mediaElement: HTMLMediaElement;
    setSeeking(b: boolean): void;
    onMediaElementEventTranslated_(eventReason: any): void;
    onPlaybackStateMachineTransition_(eventReason: any): void;
    onPlaybackStateMachineFailure_(): void;
    setMediaObserverPollingFps(pollingFps: any): void;
    onPlaybackStateMachineTransitionCbInternalTracking_(mediaSession: MediaSession, reason: PlaybackStateMachineTransitionReasons): void;
    onMediaElementEventTranslatedCbInternalTracking_(mediaSession: any, eventReason: any): void;
    onClockUpdateTimeout_(): void;
}
