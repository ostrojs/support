import { implement } from './function';

const dontAllowMethodTypeOf = ['symbol'];
const dontAllowMethodMethod = [
    'inspect', 'then', 'catch', 'finaly', 'toJSON',
    'toString', 'valueOf', 'asymmetricMatch', 'nodeType', '$$typeof',
    'default', '__esModule'
];

export interface ProxyHandlerType extends ProxyHandler<any> {
    make(target: any, key: any): any;
    call(target: any, key: any, args?: any[]): any;
    has(target: any, key: any): boolean;
    [key: string]: any;
}

const ProxyHandler: ProxyHandlerType = Object.create(null);
const macroStorage: WeakMap<object, Record<string, any>> = new WeakMap();
const getterStorage: WeakMap<object, Record<string, any>> = new WeakMap();

Object.defineProperties(ProxyHandler, {
    'construct': {
        value: function (target: any, args: any[], newtarget: any) {
            return Macroable(Reflect.construct(target, args, newtarget), ProxyHandler);
        }
    },
    'make': {
        value: function (target: any, key: any) {
            if (dontAllowMethodTypeOf.indexOf(typeof key) === -1 && dontAllowMethodMethod.indexOf(key) === -1) {
                const resource = Reflect.get(target, key);
                if (resource !== undefined) {
                    if (typeof resource === 'function') {
                        return resource.bind(target);
                    }
                    return resource;
                } else {
                    return undefined;
                }
            }
        }
    },
    'call': {
        value: function (target: any, key: any, args: any[] = []) {
            return this.make(target, key)(...args);
        }
    },
    'get': {
        value: function (target: any, key: any, receiver: any) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                return target[key];
            }

            if (typeof key === 'symbol' || Reflect.has(target, key) || target[key] !== undefined) {
                const val = target[key];
                if (typeof val === 'function') {
                    const bound = val.bind(receiver);
                    try {
                        Object.defineProperties(bound, Object.getOwnPropertyDescriptors(val));
                    } catch (_) {
                        // ignore unconfigurable properties
                    }
                    return bound;
                }
                return val;
            } else {
                if (this.has(target, '__get')) {
                    if (dontAllowMethodTypeOf.indexOf(typeof key) === -1 && dontAllowMethodMethod.indexOf(key) === -1) {
                        return (Reflect.get(target, '__get', target)).call(this, target, key, receiver);
                    }
                } else if (this.has(target, '__call')) {
                    if (dontAllowMethodTypeOf.indexOf(typeof key) === -1 && dontAllowMethodMethod.indexOf(key) === -1) {
                        const targetObj = target;
                        const targetReceiver = receiver;
                        return function (...args: any[]) {
                            const instance = targetReceiver;
                            const callFn = Reflect.get(targetObj, '__call', targetObj);
                            return callFn.call(instance, instance, key, args);
                        };
                    }
                } else {
                    return target[key];
                }
            }
        }
    },
    'apply': {
        value: function (target: any, self: any, args: any) {
            return target.call(this, self, args);
        }
    },
    'set': {
        value: function (target: any, key: any, value: any) {
            let returnValue: any;
            if (this.has(target, key)) {
                returnValue = Reflect.set(target, key, value);
            } else if (this.has(target, '__set')) {
                returnValue = Reflect.get(target, '__set').call(this, target, key, value);
            } else {
                returnValue = Reflect.set(target, key, value);
            }
            if ([undefined, 0, false].indexOf(returnValue) > -1) {
                returnValue = true;
            }
            return returnValue;
        }
    },
    'has': {
        value: function (target: any, key: any) {
            return Reflect.has(target, key);
        }
    },
    'ownKeys': {
        value: function (target: any) {
            return Reflect.ownKeys(target);
        }
    },
    'deleteProperty': {
        value: function (target: any, property: any) {
            return Reflect.deleteProperty(target, property);
        }
    }
});

export interface MacroableConstructor {
    new (...args: any[]): any;
    <T = any>(clazz?: T, handler?: any): T & { [key: string]: any };
    extend(...args: any[]): any;
    implement(clazz: any, ...clazzs: any[]): any;
    macro(name: string, callback: Function): void;
    getMacroable(name: string): any;
    hasMacroable(name: string): boolean;
    getter(name: string, callback: Function, singleton?: boolean): void;
    getGetter(name: string): any;
    hasGetter(name: string): boolean;
    hydrate(): void;
    $_macros?: Record<string, any>;
    $_getters?: Record<string, any>;
    [key: string]: any;
}

/**
 * Macroable handler.
 *
 * @param clazz - Target class or instance to make macroable.
 * @param handler - Optional custom proxy handler.
 * @returns Proxied class or instance.
 */
const Macroable: MacroableConstructor = function Macroable(this: unknown, clazz?: any, handler: any = ProxyHandler): any {
    const target = clazz || this;
    if (typeof target === 'function' && typeof target.macro !== 'function') {
        macro(target);
    }
    return new Proxy(target, handler);
} as any as MacroableConstructor;

macro(Macroable);

Macroable.extend = function (clazz: any): any {
    if (typeof clazz !== 'function') {
        throw new Error('Extend param should be Class or Function, received ' + typeof clazz);
    }
    return Macroable(clazz);
};

Macroable.implement = function (clazz: any, ...clazzs: any[]): any {
    return implement(Macroable(clazz), ...clazzs);
};

/**
 * Attach macro capabilities to a class.
 *
 * @param clazz - Target constructor function.
 */
function macro(clazz: any): void {
    Object.defineProperty(clazz, '$_macros', {
        get: function () {
            let m = macroStorage.get(this);
            if (!m) {
                m = {};
                macroStorage.set(this, m);
            }
            return m;
        },
        set: function (value) {
            macroStorage.set(this, value);
        },
        configurable: true
    });

    Object.defineProperty(clazz, '$_getters', {
        get: function () {
            let g = getterStorage.get(this);
            if (!g) {
                g = {};
                getterStorage.set(this, g);
            }
            return g;
        },
        set: function (value) {
            getterStorage.set(this, value);
        },
        configurable: true
    });

    clazz.macro = function (name: string, callback: Function): void {
        this.$_macros[name] = callback;
        this.prototype[name] = callback;
    };

    clazz.getMacroable = function (name: string): any {
        return Reflect.get(this.$_macros, name);
    };

    clazz.hasMacroable = function (name: string): boolean {
        return Reflect.has(this.$_macros, name);
    };

    clazz.getter = function (name: string, callback: Function, singleton: boolean = false): void {
        const wrappedCallback = singleton ?
            function wrappedCallback(this: any) {
                const value = callback.bind(this)();
                Object.defineProperty(this, name, { value, configurable: true });
                return value;
            } :
            callback;
        this.$_getters[name] = wrappedCallback;
        Object.defineProperty(this.prototype, name, {
            get: wrappedCallback as () => any,
            configurable: true,
            enumerable: true,
        });
    };

    clazz.getGetter = function (name: string): any {
        return Reflect.get(this.$_getters, name);
    };

    clazz.hasGetter = function (name: string): boolean {
        return Reflect.has(this.$_getters, name);
    };

    clazz.hydrate = function (): void {
        Object.keys(this.$_macros).forEach((key) => Reflect.deleteProperty(this.prototype, key));
        Object.keys(this.$_getters).forEach((key) => Reflect.deleteProperty(this.prototype, key));
        this.$_macros = {};
        this.$_getters = {};
    };
}

export { Macroable, ProxyHandler };