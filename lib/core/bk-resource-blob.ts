import { BKResource } from "./bk-resource";
import { copyArrayBuffers } from "../../ext-mod/emliri-es-libs/rialto/lib/array-buffer-utils";
import { ByteRange } from "../../ext-mod/emliri-es-libs/rialto/lib/byte-range";

export class BKResourceBlob {

    private _data: ArrayBuffer = null;
    private _parts: BKResource[] = [];

    constructor(
        public readonly resourceUri: string,
        public readonly numParts: number = 1,
        public readonly byteRange: ByteRange
    ) {

        if (numParts === 0) {
            throw new Error('Blob must have at least one part');
        }

        const partsRanges: ByteRange[] = numParts > 1 ? byteRange.split(numParts) : [byteRange];

        this._parts = partsRanges.map((range) => new BKResource(resourceUri, range));
    }

    /**
     * @returns true when all parts completed loading
     */
    isCompleted(): boolean {
        return this._parts.every((part) => part.hasData);
    }

    /**
     * @returns amount of bytes loaded from all parts. safe to call any time
     */
    getLoadedBytes(): number {
        return this._parts.reduce((bytes, part) => bytes + (part.data ? part.data.byteLength : 0), 0);
    }

    /**
     * @returns size in bytes of completed data
     * @throws if not all data loaded
     */
    getCompleteSize(): number {
        return this.getDataParts().reduce((size, buffer) => size + buffer.byteLength, 0);
    }

    /**
     * @returns array of buffers with data
     * @throws when not all buffers are present yet (not completed)
     */
    getDataParts(): ArrayBuffer[] {
        return this._parts.map((part) => {
            if (!part.data) {
                throw new Error('Can not get part of resource data with id: '
                    + part.id + ' and range: ' + part.byteRange.toString());
            }
            return part.data
        });
    }

    /**
     * @throws if not all data loaded
     * @returns buffer allocated with data from all parts concatenated in. does lazy allocation once on first access.
     */
    getData(): ArrayBuffer {
        if (!this._data) {
            const parts = this.getDataParts();
            const totalSize = this.getCompleteSize();
            this._data = copyArrayBuffers(parts, new Uint8Array(totalSize).buffer);
        }
        return this._data;
    }
}
