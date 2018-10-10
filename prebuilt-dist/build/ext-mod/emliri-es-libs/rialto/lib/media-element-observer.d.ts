import { PlaybackStateMachineTransitionReasons } from './playback-state-machine';
export declare const MediaEventReasons: typeof PlaybackStateMachineTransitionReasons;
export declare type MediaElement = HTMLMediaElement;
export declare type MediaEventHandler = () => void;
export declare type MediaEventTranslationCallback = (eventReason: string) => void;
/**
 *
 * MediaElementObserver takes a callback as argument during construction.
 *
 * Every event of media-element is thus "translated" to a single event all handled
 * through this callback. The latter is being called with a value from the `MediaEventReasons`
 * enum, which is always identical with the `PlaybackStateMachineTransitionReasons`.
 *
 * Every callback from the media-observer is therefore a potential transition cause for the playback state-machine.
 *
 * @constructor
 */
export declare class MediaElementObserver {
    private mediaEl_;
    private eventTranslatorCallback_;
    private mediaElEventHandlers_;
    private mediaElEventsRegistered_;
    private pollingInterval_;
    private pollingFps_;
    private previousMediaTime_;
    private previousEventReason_;
    readonly mediaEl: MediaElement;
    readonly hasMedia: boolean;
    /**
     * @constructs
     * @param eventTranslatorCallback
     * @param pollingFps How many frames-per-second to aim for at polling to update state
     */
    constructor(eventTranslatorCallback: any, pollingFps?: number);
    /**
     * @param pollingFps How many frames-per-second to aim for at polling to update state (pass NaN or 0 to unset)
     */
    setPollingFps(pollingFps: number): void;
    getPollingPeriodMs(): number;
    dispose(): void;
    resetMedia(): void;
    attachMedia(mediaElement: MediaElement): void;
    detachMedia(): void;
    replaceMedia(mediaElement: MediaElement): void;
    registerMediaElement(): void;
    /**
     * Should only be calld when a mediaEl is attached
     */
    unregisterMediaElement(): void;
    /**
    * Should only be calld when a mediaEl is attached
    */
    listenToMediaElementEvent(event: string, handler: MediaEventHandler): void;
    private onEventTranslated_;
    private onPollFrame_;
    /**
     * NOTE: we may want to move out of the function triggering the event itself.
     *
     * @returns {boolean}
     */
    private onPollForClockUpdate_;
}
