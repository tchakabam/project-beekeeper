export declare class TimeScale {
    private _base;
    constructor(_base?: number);
    readonly scale: number;
    readonly base: number;
    normalize(value: any): number;
    denormalize(normalValue: number): number;
}
export declare function toNormalizedFromTimebase(value: number, base: number): number;
export declare function toTimebaseFromNormal(value: number, base: number): number;
export declare function toNormalizedFromTimescale(value: number, scale: number): number;
export declare function toTimescaleFromNormal(value: number, scale: number): number;
export declare function toSecondsFromMillis(millis: any): number;
export declare function toMillsFromSeconds(seconds: any): number;
export declare function toSecondsFromMicros(millis: any): number;
export declare function toSecondsFromNanos(millis: any): number;
