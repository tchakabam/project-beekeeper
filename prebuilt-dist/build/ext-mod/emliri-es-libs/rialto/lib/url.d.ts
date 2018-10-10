/**
 * Idea is to extend from the URL W3C standard interface
 * (i.e implement it where not supported natively)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/URL
 * @see https://www.npmjs.com/package/url-polyfill (relying on this for now as implementation shim)
 */
export declare function resolveUri(relativeUri: string, baseUri: string): string;
