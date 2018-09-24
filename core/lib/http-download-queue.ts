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

import {StringlyTypedEventEmitter} from './stringly-typed-event-emitter';
import { BKResource } from './bk-resource';

import {Queue} from '../../ext-mod/emliri-es-libs/rialto/lib/queue';
import {Resource, ResourceEvents} from '../../ext-mod/emliri-es-libs/rialto/lib/resource';

const debug = Debug('bk:core:http-download-queue');

export class HttpDownloadQueue
    extends StringlyTypedEventEmitter<"segment-loaded" | "segment-error" | "bytes-downloaded"> {

    private _queue: Queue<BKResource> = new Queue();
    private _fetching: boolean = false;

    public constructor() {
        super();
    }

    public enqueue(res: BKResource): void {

        debug('enqueue', res.getUrl());

        if (this._queue.containsAtLeastOnce(res)) {
            throw new Error('Download already enqueued resource: ' + res.getUrl());
        }

        this._queue.forEach((resource) => {
            if (res.uri === resource.uri) { // FIXME: check byterange
                throw new Error('Found a resource in download queue with same URI');
            }
        });

        this._queue.enqueue(res);

        if (!this._fetching) {
            this._fetchNext();
        }

        res.on(ResourceEvents.FETCH_PROGRESS, () => {
            this.emit('bytes-downloaded', res);
        });
    }

    public abort(resource: BKResource): void {
        this._queue.forEach((res: Resource) => {
            if (res.uri === resource.uri) {
                res.abort();
            }
        });
    }

    public destroy(): void {
        // abort all
        this._queue.forEach((res: Resource) => {
            res.abort();
        });
        this._queue = null;
    }

    public getQueuedList(): BKResource[] {
        return this._queue.getArray();
    }

    private _fetchNext() {
        const nextResource: Resource = this._queue.pop();
        if (!nextResource) {
            this._fetching = false;
            return;
        }

        this._fetching = true;
        nextResource.fetch().then((res: Resource) => {
            this.emit('segment-loaded', res);
            this._fetchNext();
        }).catch((err: any) => {
            this.emit('segment-error', err);
        });
    }

}
