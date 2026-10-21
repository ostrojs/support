import ErrorBagContract from '@ostro/contracts/support/errorBag';
import { get as lodashGet, set as lodashSet } from 'lodash';

const kErrors: unique symbol = Symbol('errors');

/**
 * Class ErrorBag.
 */
class ErrorBag extends ErrorBagContract {
    [kErrors]: any;

    /**
     * Create a new instance.
     * @param objects - The initial errors object.
     */
    constructor(objects: any) {
        super();
        this[kErrors] = objects;
    }

    /**
     * Add an error key/value.
     * @param key - The property path.
     * @param value - The error value.
     * @returns The updated target object.
     */
    public add(key: string, value: any): any {
        return lodashSet(this[kErrors], key, value);
    }

    /**
     * Get error(s) by key.
     * @param key - The property path.
     * @param defaultValue - Fallback value if key is not found.
     * @returns The resolved error(s) or default.
     */
    public get(key: string, defaultValue: any = null): any {
        return lodashGet(this[kErrors], key) || defaultValue;
    }

    /**
     * Get the first error for a given key.
     * @param key - The property path.
     * @param defaultValue - Fallback value.
     * @returns The first error message or default.
     */
    public first(key: string, defaultValue: any = null): any {
        const data = this.get(key);
        return (Array.isArray(data) ? data[0] : data) || defaultValue;
    }

    /**
     * Check if a key exists in the error bag.
     * @param key - The property path.
     * @returns True if error exists, false otherwise.
     */
    public has(key: string): boolean {
        return this.get(key) != undefined;
    }
}

export default ErrorBag;