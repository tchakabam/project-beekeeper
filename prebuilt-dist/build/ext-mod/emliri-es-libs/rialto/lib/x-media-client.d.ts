import { AdaptiveMediaClient, AdaptiveMediaStreamConsumer } from "./adaptive-media-client";
import { AdaptiveMedia, AdaptiveMediaSet } from "./adaptive-media";
import { Scheduler } from '../../objec-ts/lib/scheduler';
import { MediaSourceController } from "./media-source-controller";
export declare class XMediaClient extends AdaptiveMediaClient {
    scheduler: Scheduler;
    streams: AdaptiveMediaStreamConsumer[];
    mediaSourceController: MediaSourceController;
    mediaSource: MediaSource;
    constructor(mediaElement: HTMLMediaElement);
    setSourceURL(url: string, mimeType?: string): void;
    activateMediaStream(stream: AdaptiveMedia): Promise<boolean>;
    enableMediaSet(set: AdaptiveMediaSet): void;
    private _onSegmentBuffered;
}
