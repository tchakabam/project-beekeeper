/**
 *
 * Categorized `Logger` in Typescript
 * @author Stephan Hesse <tchakabam@gmail.com>
 * @copyright 2018, 2017
 *
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
export declare function checkLogLevel(level: number, catLevel: number): boolean;
export declare type LoggerFunc = (...args: any[]) => void;
export declare type Logger = {
    info: LoggerFunc;
    log: LoggerFunc;
    debug: LoggerFunc;
    warn: LoggerFunc;
    error: LoggerFunc;
};
export declare enum LoggerLevels {
    ON,
    LOG = 5,
    INFO = 4,
    DEBUG = 3,
    WARN = 2,
    ERROR = 1,
    OFF = 0
}
export declare const getLogger: (category: string, level?: number) => Logger;
export declare function makeLogTimestamped(...args: any[]): string;
