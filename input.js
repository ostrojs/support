const InputContracts = require('@ostro/contracts/support/input')
const {get} = require('lodash')
const kInput = Symbol('input')
class Input extends InputContracts {
    constructor(objects) {
        super()
        this[kInput] = objects
    }
    get(key, defaultValue = null) {
        return get(this[kInput], key) || defaultValue;
    }
}

module.exports = Input