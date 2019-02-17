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

declare var __VERSION__: any;

export const XMLHttpRequest = require('../../ext-mod/node-http-xhr/lib');

if (global && !(window as any).XMLHttpRequest) {
    (global as any).XMLHttpRequest = XMLHttpRequest;
}

export {
    BKAccessProxyEvents,
    BKAccessProxyEvents as BKProxyEvents
} from './bk-access-proxy-events'

export {
    BKAccessProxySettings,
    BKOptAccessProxySettings
} from './bk-access-proxy-settings';

export {
    BKAccessProxy,
    BK_IProxy
} from './bk-access-proxy';

export {BKResource} from './bk-resource';

export {parseOptionsFromQueryString} from './browser-query-string';

export const version =  !global ? __VERSION__ : '';


