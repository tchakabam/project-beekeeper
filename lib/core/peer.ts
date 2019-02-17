/**
 * Copyright 2018 Novage LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as Debug from 'debug';

import {TypedEventEmitter} from './typed-event-emitter';
import { detectSafari11_0 } from './browser-detect-safari-11';

import { IPeerTransport, PeerCommandType, PeerResponseData, decodePeerResponseData } from './peer-transport';

import { BKResourceMap, BKResourceMapData } from './bk-resource-map';
import { copyArrayBuffers } from '../../ext-mod/emliri-es-libs/rialto/lib/array-buffer-utils';

// TODO: Make this ResourceRequest
class PeerDataTransmission {

    public resourceDataChunks: ArrayBuffer[] = [];

    public loadedBytes = 0;

    constructor(
        readonly resourceId: string,
        readonly totalBytes: number) {}
}

export type PeerInfo = {
    id: string,
    remoteAddress: string
};

export class BKPeer extends TypedEventEmitter
    <
    // TODO: make proper enum for these events
    "connect" | "close" | "data-updated" |
    "resource-request" | "resource-absent" | "resource-fetched" | "resource-error" | "resource-timeout" |
    "bytes-downloaded" | "bytes-uploaded"
    >
{

    private _id: string;
    private _remoteAddress: string = null;

    private debug = Debug('bk:core:peer');

    private _ongoingTransmissionResourceId: string | null = null;
    private _ongoingTransmission: PeerDataTransmission | null = null;

    private _resourceMap: BKResourceMap = BKResourceMap.create();
    private _timer: number | null = null;
    private _isSafari11_0: boolean = false;

    constructor(
            private readonly _peerTransport: IPeerTransport,
            readonly settings: {
            p2pResourceTransmissionTimeout: number,
            webRtcMaxMessageSize: number
            }) {
        super();

        this._peerTransport.on('connect', () => this._onPeerConnect());
        this._peerTransport.on('close', () => this._onPeerClose());
        this._peerTransport.on('error', (error: Error) => this.debug('peer error', this._id, error));
        this._peerTransport.on('data', this._onPeerData.bind(this));

        this._id = _peerTransport.id;

        this._isSafari11_0 = detectSafari11_0();
    }

    public get id() { return this._id; }

    public get remoteAddress(): string {
        return this._remoteAddress;
    }

    public getShortName(): string {
        return this.id.substr(0, 8) + '@' + this.remoteAddress;
    }

    /**
     * Used for serialization i.e monitoring/metrics
     */
    public getInfo(): PeerInfo {
        return {
            id: this.id,
            remoteAddress: this.remoteAddress
        };
    }

    public destroy(): void {
        this.debug(`destroying local handle for remote peer (id='${this._id}') -> ciao bella :)`);
        this._terminateResourceRequest();
        this._peerTransport.destroy();
    }

    public getOnoingTransmissionResourceId(): string | null {
        return this._ongoingTransmissionResourceId;
    }

    public getResourceMap(): BKResourceMap {
        return this._resourceMap;
    }

    public sendResourceMap(mapData: BKResourceMapData): void {
        this._sendCommand({type: PeerCommandType.ResourceMap, map: mapData});
    }

    public sendResourceData(resourceId: string, data: ArrayBuffer): void {
        this._sendCommand({
            type: PeerCommandType.ResourceData,
            resource_id: resourceId,
            resource_size: data.byteLength
        });

        let bytesLeft = data.byteLength;

        while (bytesLeft > 0) {
            const bytesToSend
                = (bytesLeft >= this.settings.webRtcMaxMessageSize
                    ? this.settings.webRtcMaxMessageSize : bytesLeft);

            const buffer: Buffer = this._isSafari11_0 ?
                Buffer.from(data.slice(data.byteLength - bytesLeft, data.byteLength - bytesLeft + bytesToSend)) : // workaround for Safari 11.0 bug: https://bugs.webkit.org/show_bug.cgi?id=173052
                Buffer.from(data, data.byteLength - bytesLeft, bytesToSend); // avoid memory copying

            this._peerTransport.write(buffer);
            bytesLeft -= bytesToSend;
        }

        this.emit('bytes-uploaded', data.byteLength);
    }

    public sendResourceAbsent(resourceId: string): void {
        this._sendCommand({type: PeerCommandType.ResourceAbsent, resource_id: resourceId});
    }

    public sendResourceRequest(resourceId: string): void {
        if (this._ongoingTransmissionResourceId) {
            throw new Error('A resource is already downloading: ' + this._ongoingTransmissionResourceId);
        }

        this._sendCommand({type: PeerCommandType.ResourceRequest, resource_id: resourceId});
        this._ongoingTransmissionResourceId = resourceId;
        this._scheduleResponseTimeout();
    }

    public sendResourceRequestAbort(): void {
        if (this._ongoingTransmissionResourceId) {
            const resourceId = this._ongoingTransmissionResourceId;
            this._terminateResourceRequest();
            this._sendCommand({type: PeerCommandType.ResourceRequestAbort, resource_id: resourceId});
        }
    }

    public getTransportInterface(): IPeerTransport {
        return this._peerTransport;
    }

    private _sendCommand(command: PeerResponseData): void {
        this.debug(`sending command "${command.type}" to remote peer (id='${this._id}') `);
        this._peerTransport.write(JSON.stringify(command));
    }

    private _scheduleResponseTimeout(): void {
        this._timer = window.setTimeout(() => {
            this._timer = null;
            if (!this._ongoingTransmissionResourceId) {
                return;
            }
            const resourceId = this._ongoingTransmissionResourceId;
            this.sendResourceRequestAbort();
            this.emit('resource-timeout', this, resourceId); // TODO: send peer not responding event
        }, this.settings.p2pResourceTransmissionTimeout);
    }

    private _cancelResponseTimeout(): void {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    private _terminateResourceRequest() {
        this._ongoingTransmissionResourceId = null;
        this._ongoingTransmission = null;
        this._cancelResponseTimeout();
    }

    private _handleResourceDataReceived(data: ArrayBuffer): void {

        this.debug(`received resource data from remote peer (id='${this._id}')`);

        if (!this._ongoingTransmission) {
            // The resource was not requested or canceled
            this.debug(`received data from remote peer (id='${this._id}') for non-requested or aborted resource transmission :(`);
            //return;

            console.log(data);

            throw new Error('Runtime self-check failed: unexpected data received from peer')
        }

        this._ongoingTransmission.loadedBytes += data.byteLength;
        this._ongoingTransmission.resourceDataChunks.push(data);
        this.emit('bytes-downloaded', data.byteLength);

        const resourceId = this._ongoingTransmission.resourceId;

        if (this._ongoingTransmission.loadedBytes == this._ongoingTransmission.totalBytes) {

            const resourceDataBuf = copyArrayBuffers(this._ongoingTransmission.resourceDataChunks,
                new Uint8Array(this._ongoingTransmission.totalBytes).buffer);

            this.debug('peer resource transfer done', this._id, resourceId);

            this._terminateResourceRequest();

            this.emit('resource-fetched', this, resourceId, resourceDataBuf);

        } else if (this._ongoingTransmission.loadedBytes > this._ongoingTransmission.totalBytes) {

            this.debug(`remote peer (id='${this._id}'): transferred resource bytes mismatch!!!`, resourceId);

            console.error('There was a fatal peer transaction error :(');

            this._terminateResourceRequest();
            this.emit('resource-error', this, resourceId, 'Too many bytes received for resource');
        }
    }

    private _onPeerData(data: ArrayBuffer): void {

        ///*
        if (data instanceof Buffer) {
            data = data.buffer;
        }
        //*/

        if (!(data instanceof ArrayBuffer)) {
            console.log(data)
            throw new Error('Assertion failed: data not an ArrayBuffer');
        }

        const peerResponse = decodePeerResponseData(data);
        if (!peerResponse) {
            this._handleResourceDataReceived(data);
            return;
        }

        if (this._ongoingTransmission) {
            this.debug('peer resource download is interrupted by a command, peer-id:', this._id);

            const resourceId = this._ongoingTransmission.resourceId;
            this._terminateResourceRequest();
            this.emit('resource-error', this, resourceId, 'Resource download is interrupted by a command');
            return;
        }

        this.debug('peer receive command, peer-id:', this._id,'type:', peerResponse.type);

        switch (peerResponse.type) {
        case PeerCommandType.ResourceMap:
            if (!peerResponse.map) {
                throw new Error('No `map` property found in parsed data');
            }
            this._resourceMap = BKResourceMap.create(peerResponse.map);
            this.emit('data-updated');
            break;

        case PeerCommandType.ResourceRequest:
            this.emit('resource-request', this, peerResponse.resource_id);
            break;

        case PeerCommandType.ResourceData:
            if (this._ongoingTransmissionResourceId === peerResponse.resource_id) {
                if (!peerResponse.resource_size) {
                    throw new Error('No `resource_size` found in data');
                }
                this._ongoingTransmission = new PeerDataTransmission(peerResponse.resource_id, peerResponse.resource_size);
                this._cancelResponseTimeout();
            }
            break;

        case PeerCommandType.ResourceAbsent:
            if (this._ongoingTransmissionResourceId === peerResponse.resource_id) {
                this._terminateResourceRequest();
                this._resourceMap.delete(peerResponse.resource_id);
                this.emit('resource-absent', this, peerResponse.resource_id);
            }
            break;

        case PeerCommandType.ResourceRequestAbort:
            // TODO: peer stop sending buffer
            break;

        default:
            break;
        }
    }

    private _onPeerConnect(): void {
        this.debug(`remote peer (id='${this._id}') connection open`);
        this._remoteAddress = this._peerTransport.remoteAddress;
        this.emit('connect', this);
    }

    private _onPeerClose(): void {
        this.debug(`remote peer (id='${this._id}') connection closed`);
        this._terminateResourceRequest();
        this.emit('close', this);
    }
}
