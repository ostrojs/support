import _ from 'lodash';

declare global {
    interface ObjectConstructor {
        filter<T extends Record<string, any>>(obj: T, cb?: (val: any) => any): T;
        except<T extends Record<string, any>>(obj: T, keys: string[]): Partial<T>;
        flip(obj: Record<string, any>): Record<string, any>;
    }
}

export function filter<T extends Record<string, any>>(obj: T, cb?: (val: any) => any): T {
    const keys = Object.keys(obj);
    for (const key of keys) {
        const data = typeof cb == 'function' ? cb(obj[key]) : obj[key];
        if (!data) {
            delete (obj as Record<string, unknown>)[key];
        }
    }
    return obj;
}

export function except<T extends Record<string, any>>(obj: T, keys: string[]): Partial<T> {
    const target: Partial<T> = {};
    for (const i in obj) {
        if (keys.indexOf(i) >= 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
    }
    return target;
}

export function flip(obj: Record<string, any>): Record<string, any> {
    return _.transform(obj, function (res: Record<string, any>, val: any, key: string) {
        if (_.isPlainObject(val)) {
            res[key] = flip(val);
        } else {
            res[val] = key;
        }
    });
}

Object.filter = filter;
Object.except = except;
Object.flip = flip;

export default {
    filter,
    except,
    flip
};