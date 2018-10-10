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
import { BKResource } from './bk-resource';
import { Resource } from '../../ext-mod/emliri-es-libs/rialto/lib/resource';
export declare class HttpDownloadQueue {
    private _onLoaded;
    private _onError;
    private _queue;
    private _fetching;
    constructor(_onLoaded: (res: Resource) => void, _onError: (res: Resource, err: Resource) => void);
    enqueue(res: BKResource): void;
    abort(resource: BKResource): void;
    destroy(): void;
    getQueuedList(): BKResource[];
    private _fetchNext;
}
