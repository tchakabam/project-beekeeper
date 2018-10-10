/**
 * @module
 *
 * Functions to read & write coded types from/to bytes buffers in memory
 *
 */
export declare const MAX_UINT_32 = 4294967296;
export declare const MAX_UINT_16 = 65536;
export declare const readUint16: (buffer: Uint8Array, offset: number) => number;
export declare const readUint32: (buffer: Uint8Array, offset: number) => number;
export declare const writeUint32: (buffer: Uint8Array, offset: number, value: number) => void;
export declare const utf8BytesToString: (bytes: Uint8Array) => string;
export declare const unicodeBytesToString: (bytes: Uint16Array) => string;
export declare function utf8StringToArray(str: string): ArrayBuffer;
