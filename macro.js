let dontAllowMethodTypeOf = ['symbol']
let dontAllowMethodMethod = ['inspect', 'then', 'catch', 'finaly', 'toJSON', 'toString', 'valueOf', 'asymmetricMatch', 'nodeType', '$$typeof']
const { implement } = require('./function');
const ProxyHandler = Object.create(null);
const kMacros = Symbol('macros')
const kGetters = Symbol('getters')
Object.defineProperties(ProxyHandler, {
    'construct': {
        value: function(target, args, newtarget) {
            return Macroable(Reflect.construct(target, args, newtarget), ProxyHandler);

        }
    },
    'make': {
        value: function(target, key) {
            if (dontAllowMethodTypeOf.indexOf(typeof key) == -1 && dontAllowMethodMethod.indexOf(key) == -1) {
                let resource = Reflect.get(target, key)
                if (resource != undefined) {
                    if (typeof resource == 'function') {
                        return resource.bind(target)
                    }
                    return resource
                } else {
                    return undefined
                }
            }
        }
    },
    'call': {
        value: function(target, key, args = []) {
            return this.make(target, key)(...args)
        }
    },
    'get': {
        value: function(target, key, receiver) {

            if (Object.prototype.hasOwnProperty.call(target, key)) {
                return target[key];
            }

            if (typeof key === 'symbol' || key in target || Reflect.has(target, key) || target[key] !== undefined) {
                let val = target[key];
                if (typeof val === 'function') {
                    return val.bind(receiver || target);
                }
                return val;
            } else {

                if (this.has(target, '__get')) {
                    if (dontAllowMethodTypeOf.indexOf(typeof key) == -1 && dontAllowMethodMethod.indexOf(key) == -1) {
                        return (Reflect.get(target, '__get', target)).call(this, target, key, receiver)
                    }
                } else if (this.has(target, '__call')) {
                    if (dontAllowMethodTypeOf.indexOf(typeof key) == -1 && dontAllowMethodMethod.indexOf(key) == -1) {
                        let targetObj = target;
                        let targetReceiver = receiver;
                        return function(...args) {
                            let instance = targetReceiver || targetObj;
                            let callFn = Reflect.get(targetObj, '__call', targetObj);
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
        value: function(target, self, args) {
            return target.call(this, self, args)
        }
    },
    'set': {
        value: function(target, key, value) {
            let returnValue
            if (this.has(target, key)) {
                returnValue = Reflect.set(target, key, value)
            } else if (this.has(target, '__set')) {
                returnValue = Reflect.get(target, '__set').call(this, target, key, value)
            } else {
                returnValue = Reflect.set(target, key, value)
            }
            if ([undefined, 0, false].indexOf(returnValue) > -1) {
                returnValue = true
            }
            return returnValue
        }
    },
    'has': {
        value: function(target, key) {
            return Reflect.has(target, key);
        }
    },
    'ownKeys': {
        value: function(target) {
            return Reflect.ownKeys(target)
        }
    },
    'deleteProperty': {
        value: function(target, property) {
            return Reflect.deleteProperty(target, property)

        }
    },



})

function Macroable(clazz) {

    clazz = clazz || this
    if (typeof clazz == 'function' && typeof clazz.macro != 'function') {
        macro(clazz)
    }
    return new Proxy(clazz, ProxyHandler)
}

macro(Macroable)

Macroable.extend = function(clazz) {
    if (typeof clazz != 'function') {
        throw new Error('Extend param should be Class or Function, received ' + typeof clazz)
    }
    return Macroable(clazz)
}

Macroable.implement = function(clazz, ...clazzs) {
    return implement(Macroable(clazz), ...clazzs)
}

function macro(clazz) {
    Object.defineProperty(clazz, '$_macros', {
        get: function() {
            return this[kMacros] = this[kMacros] || {}
        },
        set: function(value) {
            return this[kMacros] = value
        },
    })

    Object.defineProperty(clazz, '$_getters', {
        get: function() {
            return this[kGetters] = this[kGetters] || {}
        },
        set: function(value) {
            return this[kGetters] = value
        }
    })


    clazz.macro = function(name, callback) {
        this.$_macros[name] = callback;
        this.prototype[name] = callback;
    }

    clazz.getMacroable = function(name) {
        return Reflect.get(this.$_macros, name);
    }

    clazz.hasMacroable = function(name) {
        return Reflect.has(this.$_macros, name)
    }

    clazz.getter = function(name, callback, singleton = false) {
        const wrappedCallback = singleton ?
            function wrappedCallback() {
                const value = callback.bind(this)();
                Object.defineProperty(this, name, { value, configurable: true });
                return value;
            } :
            callback;
        this.$_getters[name] = wrappedCallback;
        Object.defineProperty(this.prototype, name, {
            get: wrappedCallback,
            configurable: true,
            enumerable: true,
        });
    }

    clazz.getGetter = function(name) {
        return Reflect.get(this.$_getters, name)

    }

    clazz.hasGetter = function(name) {
        return Reflect.has(this.$_getters, name);
    }

    clazz.hydrate = function() {
        Object.keys(this.$_macros).forEach((key) => Reflect.deleteProperty(this.prototype, key));
        Object.keys(this.$_getters).forEach((key) => Reflect.deleteProperty(this.prototype, key));
        this.$_macros = {};
        this.$_getters = {};
    }

}

exports.Macroable = Macroable