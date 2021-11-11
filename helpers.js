let loaded = false;
(function globals() {
    if (!loaded) {
        loaded = true
        const { ...functions } = require('./function')
        const { ...arrays } = require('./array')
        require('./string')
        require('./object')
        Object.keys(functions).map(helperKey => {
            global[helperKey] = functions[helperKey]
        })
        Object.keys(arrays).map(arraykey => {
            Array.prototype[arraykey] = arrays[arraykey]
        })
    }
})()