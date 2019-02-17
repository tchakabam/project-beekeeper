import { TypedEventEmitter } from './typed-event-emitter';

import {NetworkChannelEmulator} from './network-channel-emulator';

import * as Debug from 'debug';

import { BKResourceMapData } from './bk-resource-map';

import { utf8BytesToString } from '../../ext-mod/emliri-es-libs/rialto/lib/bytes-read-write';

const debug = Debug('bk:core:peer-transport');

export enum PeerCommandType {
    ResourceData = 'resource-data',
    ResourceAbsent = 'resource-absent',
    ResourceMap = 'resource-map',
    ResourceRequest = 'resource-request',
    ResourceRequestAbort = 'resource-request-abort',
}

export type PeerResponseData = {
    type: PeerCommandType
    resource_id?: string
    resource_size?: number
    map?: BKResourceMapData
};

// TODO: marshall parsed data
export function decodePeerResponseData(data: ArrayBuffer): PeerResponseData | null {
    const bytes = new Uint8Array(data);
    // Serialized JSON string check by first, second and last characters: '{" .... }'
    if (bytes[0] == 123 && bytes[1] == 34 && bytes[data.byteLength - 1] == 125) {
        try {
            return JSON.parse(utf8BytesToString(bytes));
            // BROKEN: line below doesn't work in Node, this above does ^
            //return JSON.parse(new TextDecoder('utf-8').decode(data));
        } catch(err) {
            // ignoring any errors as this is how we basically do check JSON vs binary data, aarg :D
            //console.error(err);
            //throw new Error('Failed to decode message: ' + err.message)
        }
    }
    return null;
}

export interface IPeerTransport {
    readonly id: string;
    readonly remoteAddress: string;

    write(buffer: Buffer | string): void;

    on(event: "connect" | "close", handler: () => void): void;
    on(event: "error", handler: (error: Error) => void): void;
    on(event: "data", handler: (data: ArrayBuffer) => void): void;

    destroy(): void;

    setMaxBandwidthBps(n: number): boolean;
    setMinLatencyMs(n: number): boolean;
}

export type PeerTransportFilterFactory = (transport: IPeerTransport) => IPeerTransport;

export class DefaultPeerTransportFilter
    extends TypedEventEmitter<"connect" | "close" | "error" | "data">
    implements IPeerTransport {

    private _netEmIn: NetworkChannelEmulator
        = new NetworkChannelEmulator(this._onNetChannelInData.bind(this));

    private _netEmOut: NetworkChannelEmulator
        = new NetworkChannelEmulator(this._onNetChannelOutData.bind(this));

    constructor(private _transport: IPeerTransport) {
        super();

        this._transport.on('connect', () => this._onConnect());
        this._transport.on('close', () => this._onClose());
        this._transport.on('error', (error) => this._onError(error));
        this._transport.on('data', (data) => this._onData(data));

    }

    get id(): string {
        return this._transport.id;
    }

    get remoteAddress(): string {
        return this._transport.remoteAddress;
    }

    write(buffer: string | Buffer): void {
        if (typeof buffer === 'string') {
            debug(`writing utf8-data to remote peer (id='${this.id}'), byte-length is ${buffer.length}`);
        } else {
            debug(`writing binary-data to remote peer (id='${this.id}'), byte-length is ${buffer.byteLength}`);
        }
        this._netEmOut.push(buffer);
    }

    destroy(): void {
        this._transport.destroy();
    }

    setMaxBandwidthBps(n: number): boolean {
        debug(`setting peer-transport ${this.id} max-bandwidth to ${n} bps`)
        this._netEmIn.maxBandwidthBps = n;
        this._netEmOut.maxBandwidthBps = n;
        return true;
    }

    setMinLatencyMs(n: number): boolean {
        this._netEmIn.maxBandwidthBps = n;
        this._netEmOut.maxBandwidthBps = n;
        return true;
    }

    private _onConnect() {
        debug('connect');
        this.emit('connect');
    }

    private _onClose() {
        debug('close');
        this.emit('close');
    }

    private _onError(error: Error) {
        debug('error');
        this.emit('error', error);
    }

    private _onData(data: ArrayBuffer) {
        debug('input data');
        this._netEmIn.push(data);
    }

    private _onNetChannelInData(data: ArrayBuffer) {
        debug('input netem data');
        this.emit('data', data);
    }

    private _onNetChannelOutData(data: Buffer) {
        this._transport.write(data);
    }
}
