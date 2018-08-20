import { EventEmitter } from "events";
import { LoaderInterface, HybridLoader, Events } from "../../core/lib";

export class Engine extends EventEmitter {

    public static isSupported(): boolean {
        return HybridLoader.isSupported();
    }

    private readonly loader: LoaderInterface;
    private readonly segmentManager: SegmentManager;

    public constructor(settings: any = {}) {
        super();

        this.loader = new HybridLoader(settings.loader);

        Object.keys(Events)
            .map(eventKey => Events[eventKey as any])
            .forEach(event => this.loader.on(event, (...args: any[]) => this.emit(event, ...args)));
    }

    public createLoaderClass(): any {

    }

    public destroy() {
        this.loader.destroy();
    }

    public getSettings(): any {
        return {
            loader: this.loader.getSettings()
        };
    }

    public setPlayingSegment(url: string) {
        this.segmentManager.setPlayingSegment(url);
    }
}
