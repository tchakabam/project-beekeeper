/**
 *
 * Finds boxes in a data buffer given the hierarchical path.
 * Returns all boxes that match the path endpoint as an array.
 *
 * Example: `let allTrakBoxes = findIsoBmffBoxes(initSegment, ['moov', 'trak']);`
 *
 * @param {Uint8Array} data
 * @param {string[]} path
 * @param {number} start
 * @returns {MpegIsoBmffBox[]}
 */
export declare const findIsoBmffBoxes: (data: Uint8Array, path: string[], start?: number) => MpegIsoBmffBox[];
/**
 * Container object for one ISO FF box
 *
 * @constructor
 */
export declare class MpegIsoBmffBox {
    static fromPath(data: Uint8Array, path: string[]): MpegIsoBmffBox;
    data: Uint8Array;
    start: number;
    end: number;
    type: string;
    constructor(data: Uint8Array, start: number, end: number, type?: string);
}
