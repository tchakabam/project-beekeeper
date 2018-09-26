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

const PREFIX_ROOT = 'P2PML';

const noop = () => {};

const getPrefix = function(type: string, category: string): string {
    const prefix = `[${PREFIX_ROOT}]:[${type}]:[${category}] >`;
    return prefix;
};

export function checkLogLevel(level: number, catLevel: number): boolean {
    switch(catLevel) {
    case LoggerLevels.INFO: return !! ((level >= LoggerLevels.INFO) && console.info);
    case LoggerLevels.LOG: return !! ((level >= LoggerLevels.LOG) && console.log);
    case LoggerLevels.DEBUG: return !! ((level >= LoggerLevels.DEBUG) && console.debug);
    case LoggerLevels.WARN: return !! ((level >= LoggerLevels.WARN) && console.warn);
    case LoggerLevels.ERROR: return !! ((level >= LoggerLevels.ERROR) && console.error);
    }
    return false;
}

export type LoggerFunc = (...args: any[]) => void;

export type Logger = {
  info: LoggerFunc,
  log: LoggerFunc
  debug: LoggerFunc
  warn: LoggerFunc
  error: LoggerFunc
};

export enum LoggerLevels {
  ON = Infinity,
  LOG = 5,
  INFO = 4,
  DEBUG = 3,
  WARN = 2,
  ERROR = 1,
  OFF = 0
}

export const getLogger = function(category: string, level: number = LoggerLevels.ON): Logger {
    var window = self; // Needed for WebWorker compat

    return {
        info: checkLogLevel(level, LoggerLevels.INFO) ? console.info.bind(window['console'], getPrefix('i', category)) : noop,
        log: checkLogLevel(level, LoggerLevels.LOG) ? console.log.bind(window['console'], getPrefix('l', category)) : noop,
        debug: checkLogLevel(level, LoggerLevels.DEBUG) ? console.debug.bind(window['console'], getPrefix('d', category)) : noop,
        warn: checkLogLevel(level, LoggerLevels.WARN) ? console.warn.bind(window['console'], getPrefix('w', category)) : noop,
        error: checkLogLevel(level, LoggerLevels.ERROR) ? console.error.bind(window['console'], getPrefix('e', category)) : noop
    };
};

export function makeLogTimestamped(...args: any[]): string {
    let message = `[${(new Date()).toISOString()}]`;
    args.forEach((arg) => {
        message += ' ' + arg;
    });
    return message;
}
