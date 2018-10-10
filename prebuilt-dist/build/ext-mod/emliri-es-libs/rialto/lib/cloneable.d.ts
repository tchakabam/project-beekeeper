export interface Cloneable<T> {
    clone(): T;
}
/**
 *
 * Deep-clones an object.
 *
 * Uses JSON stringify-parse method
 * @see https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
 * "stringify" proven fastest method to do deep-cloning @see http://jsben.ch/bWfk9
 * @param o
 */
export declare function deepCloneObject<T>(o: any): T;
/**
 *
 * Copies all own enumarable properties of an object (map-dictionnary-like clone)
 *
 * Allows to specify wether the new object should be a plain map (prototype-less)
 *
 * Be aware that functions that are own properties will not change their bound context upon copying.
 *
 * @param o
 * @param asMap
 */
export declare function shallowCloneObject<T>(o: any, asMap: boolean): T;
/**
 * Copies all own enumarable properties of an object (map-dictionnary-like clone)
 * into a new instance with the given prototype and class properties.
 *
 * Be aware that functions that are own properties will not change their bound context upon copying.
 *
 * Methods of the passed prototype will obviously be bound to the instance as part of the object creation.
 *
 * @param o
 * @param proto
 */
export declare function shallowCloneObjectWithPrototype<T>(o: any, proto: object, properties: PropertyDescriptorMap): T;
/**
 * Implements Cloneable interface with deep method
 */
export declare class CloneableObject<T> implements Cloneable<T> {
    clone(): T;
}
/**
 * Implements cloneable interface with shallow method.
 */
export declare class CloneableScaffold<T> implements Cloneable<T> {
    clone(): T;
}
/**
 * Implements cloneable interface with shallow method.
 *
 * Constructs a prototype-less object (plain map)
 * and uses `asMap` flag for shallow-copy.
 */
export declare class CloneableDictionnary<T> implements Cloneable<T> {
    constructor();
    clone(): T;
}
