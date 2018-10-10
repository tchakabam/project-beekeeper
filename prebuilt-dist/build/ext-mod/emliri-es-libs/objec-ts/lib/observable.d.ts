import { EventEmitter } from 'eventemitter3';
export declare type ObservablesMap = Map<symbol, ObservablesMapEntry>;
export declare type ObservablesMapEntry = {
    key: ObservableType;
    events: symbol[];
};
export declare type EventCallbackFunction = (event: symbol, obs: Observable) => void;
export declare class ObservableType {
    id: symbol;
    constructor(name?: string);
}
export declare abstract class Observable extends EventEmitter {
    private type_;
    constructor(typeKey: ObservableType);
    emit(event: symbol): boolean;
    on(event: symbol | string, fn: EventCallbackFunction): this;
    readonly type: ObservableType;
    static registerEventSymbol(key: ObservableType, event: string | symbol): void;
    static getEventSymbols(type: ObservableType): symbol[];
    static hasEventSymbol(type: ObservableType, event: symbol): boolean;
}
