let loaded = false;
(function globals() {
    if (!loaded) {
        loaded = true
        const { ...functions } = require('./function')
        const { ...arrays } = require('./array')
        const strings = require('./string')
        require('./object')
        Object.keys(functions).map(helperKey => {
            global[helperKey] = functions[helperKey]
        })
        Object.keys(arrays).map(arraykey => {
            Object.defineProperty(Array.prototype, arraykey, {
                value: arrays[arraykey],
                enumerable: false,
                writable: true,
                configurable: true
            });
        })
        const nativeStringProtoProps = new Set(Object.getOwnPropertyNames(String.prototype));
        Object.keys(strings).map(strKey => {
            const strFn = strings[strKey];
            String[strKey] = strFn;
            if (!nativeStringProtoProps.has(strKey)) {
                Object.defineProperty(String.prototype, strKey, {
                    value: function (...args) {
                        return strFn(this, ...args);
                    },
                    enumerable: false,
                    writable: true,
                    configurable: true
                });
            }
        })
    }
})()
