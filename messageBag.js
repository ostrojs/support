const MessageBagContracts = require('@ostro/support/messageBag')
const { get, set } = require('lodash')
const kMessage = Symbol('message')
class MessageBag extends MessageBagContracts {
    constructor(objects) {
        super()
        this[kMessage] = objects
    }
    add(key, value) {
        return set(this[kMessage], key, value)
    }
    get(key, defaultValue = null) {
        return get(this[kMessage], key) || defaultValue;
    }
    first(key, defaultValue = null) {
        let data = this.get(key)
        return (Array.isArray(data) ? data[0] : data) || defaultValue;
    }
    has(key) {
        return this.get(key) != undefined;
    }
    all() {
        return this[kMessage]
    }
}
module.exports = MessageBag