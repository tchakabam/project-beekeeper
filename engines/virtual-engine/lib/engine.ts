import { EventEmitter } from "eventemitter3";
import { LoaderInterface, HybridLoader, Events } from "../../../core/lib";
import { SegmentManager } from "./segment-manager";

export class Engine extends EventEmitter {

    public static isSupported(): boolean {
        return HybridLoader.isSupported();
    }

    private readonly loader: LoaderInterface;
    private readonly segmentManager: SegmentManager;

    public constructor(settings: any = {}) {
        super();

        this.loader = new HybridLoader(settings.loader);
        this.segmentManager = new SegmentManager(this.loader);

        Object.keys(Events)
            .map(eventKey => Events[eventKey as any])
            .forEach(event => this.loader.on(event, (...args: any[]) => this.emit(event, ...args)));
    }

    public destroy() {
        this.loader.destroy();
    }

    public getSettings(): any {
        return {
            segments: this.segmentManager.getSettings(),
            loader: this.loader.getSettings()
        };
    }

    public setPlayingSegment(url: string) {
        this.segmentManager.setPlayingSegment(url);
    }
}
