const ErrorBagcontract = require('@ostro/contracts/support/errorBag')
const { get, set } = require('lodash')
const kErrors = Symbol('errors')
class ErrorBag extends ErrorBagcontract {
    constructor(objects) {
        super()
        this[kErrors] = objects
    }
    add(key, value) {
        return set(this[kErrors], key, value);
    }
    get(key, defaultValue = null) {
        return get(this[kErrors], key) || defaultValue;
    }
    first(key, defaultValue = null) {
        let data = this.get(key)
        return (Array.isArray(data) ? data[0] : data) || defaultValue;
    }
    has(key) {
        return this.get(key) != undefined;
    }
}

module.exports = ErrorBag