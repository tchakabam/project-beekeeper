export declare class ByteRange {
    from: number;
    to: number;
    total: number;
    /**
     * Assumes input like `"0-99"`
     * @param rawByteRange
     */
    static fromString(rawByteRange: string): ByteRange;
    constructor(from: number, to: number, total?: number);
    toHttpHeaderValue(contentRange?: boolean): string;
    toString(): string;
}
