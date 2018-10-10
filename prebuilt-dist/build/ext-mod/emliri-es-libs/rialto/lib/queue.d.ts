import { EventEmitter } from 'eventemitter3';
export declare class Queue<T> extends EventEmitter {
    private _list;
    /**
     * Returns a copy of the internal array
     */
    getArray(): Array<T>;
    readonly size: number;
    /**
     * First item
     */
    begin(): T;
    /**
     * Last item
     */
    end(): T;
    /**
     * Adds to the end
     * @param item
     */
    add(item: T): Queue<T>;
    /**
     * Removes from the end
     */
    subtract(): T;
    /**
     * Alias for subtract method
     */
    pop(): T;
    /**
     * Adds to the begin
     * @param item
     */
    enqueue(item: T): Queue<T>;
    /**
     * Removes from begin
     */
    dequeue(): T;
    insertAt(index: number, ...items: T[]): Queue<T>;
    removeAll(item: T, limit?: number): number;
    removeOne(item: T): boolean;
    get(index: number): T;
    forEach(forEachFn: (item: any, index?: any) => void): Queue<T>;
    containsAtLeastOnce(item: T): boolean;
}
