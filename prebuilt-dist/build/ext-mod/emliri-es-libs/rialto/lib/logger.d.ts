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
