import { EventEmitter } from 'eventemitter3';
import { MediaElement } from './media-element-observer';
export declare enum PlaybackStateMachineEvents {
    STATE_TRANSITION = "state-transition",
    FAILURE = "failure"
}
export declare enum PlaybackStateMachineTransitionReasons {
    MEDIA_ERROR = "media-error",
    MEDIA_RECOVER = "media-recover",
    MEDIA_ENGINE_INIT = "media-engine-init",
    MEDIA_LOADING_PROGRESS = "media-loading-progress",
    MEDIA_CLOCK_UPDATE = "media-clock-update",
    MEDIA_DURATION_CHANGE = "media-duration-change",
    MEDIA_AUTO_PLAY = "media-autoplay",
    MEDIA_MANUAL_PLAY = "media-manual-play",
    MEDIA_PAUSE = "media-pause",
    MEDIA_BUFFER_UNDERRUN = "media-buffer-underrun",
    MEDIA_SEEK = "media-seek",
    MEDIA_END = "media-end",
    STATE_TRANSITION_FAIL = "state-transition-fail"
}
export declare enum PlaybackState {
    NULL = "null",
    READY = "ready",
    METADATA_LOADING = "metadata-loading",
    PAUSED = "paused",
    PLAYING = "playing",
    ENDED = "ended",
    ERROR = "error"
}
export declare enum PlaybackSubState {
    DEFAULT = "default",
    FIRST_BUFFERING = "first-buffering",
    REBUFFERING = "rebuffering",
    SEEKING = "seeking"
}
export declare const PlaybackStateMachineTransitions: PlaybackStateTransition[];
export declare type PlaybackStateTransition = [PlaybackState, PlaybackState, PlaybackStateMachineTransitionReasons];
export declare class PlaybackStateMachine extends EventEmitter {
    static inspectTransition(transition: any): {
        from: any;
        to: any;
        reason: any;
    };
    static mapInspectTransitionsArray(transitionsArray: any): any;
    static lookupStateOfMediaElement(mediaEl: any): PlaybackState;
    private state_;
    private previousState_;
    private error_;
    constructor(initialStateOrMediaElement: MediaElement | PlaybackState);
    triggerStateTransition(eventReason: any): void;
    findPossibleTransitions_(eventReason: any, backward: any): [PlaybackState, PlaybackState, PlaybackStateMachineTransitionReasons][];
    notifyError_(err: any): void;
    getNextPossibleStates(): PlaybackState[];
    getPreviousPossibleStates(): PlaybackState[];
    emit(eventType: any, eventReason: any): boolean;
    readonly state: PlaybackState;
    readonly previousState: PlaybackState;
    readonly error: Error;
}
