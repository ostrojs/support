import _ from 'lodash';

/**
 * Group array items by a property or callback function.
 *
 * @typeParam T - Array element type.
 * @param this - Array instance.
 * @param funcProp - Property name or selector function.
 * @returns Grouped dictionary.
 */
export function groupBy<T = any>(
    this: T[] | void,
    funcProp: ((val: T) => any) | string | number
): Record<string, T[]> {
    const value = typeof funcProp === 'function' ? funcProp : (vall: any) => vall[funcProp];
    return (this as T[]).reduce(function (acc: Record<string, T[]>, val: T) {
        const key = String(value(val));
        (acc[key] = acc[key] || []).push(val);
        return acc;
    }, {});
}

/**
 * Get the last element of the array.
 *
 * @typeParam T - Array element type.
 * @param this - Array instance.
 * @returns The last item or undefined.
 */
export function last<T = any>(this: T[]): T | undefined {
    return this[this.length - 1];
}

/**
 * Get the intersection of this array with another array.
 *
 * @typeParam T - Array element type.
 * @param this - Array instance.
 * @param arr - Comparison array.
 * @returns Intersection array.
 */
export function intersection<T = any>(this: T[], arr: any[] = []): T[] {
    return _.intersection(this, arr);
}

/**
 * Shuffle the array elements.
 *
 * @typeParam T - Array element type.
 * @param this - Array instance.
 * @returns Shuffled array.
 */
export function shuffle<T = any>(this: T[]): T[] {
    return _.shuffle(this);
}

/**
 * Return duplicate-free version of an array.
 *
 * @typeParam T - Array element type.
 * @param this - Array instance.
 * @param key - Iteratee key.
 * @returns Deduplicated array.
 */
export function unique<T = any>(this: T[], key?: any): T[] {
    return _.uniq(this, key);
}

/**
 * Get the difference of this array from another array.
 *
 * @typeParam T - Array element type.
 * @param this - Array instance.
 * @param arr - Comparison array.
 * @returns Difference array.
 */
export function diff<T = any>(this: T[], arr?: any[]): T[] {
    return _.difference(this, arr);
}

export const difference = diff;

/**
 * Wrap a value in an array if it is not already an array.
 *
 * @typeParam T - Value type.
 * @param value - Target value.
 * @returns Wrapped array.
 */
export function wrap<T = any>(value?: T | T[] | null): T[] {
    if (value === null || value === undefined) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}
