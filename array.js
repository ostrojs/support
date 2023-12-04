const _ = require('lodash')

exports.groupBy = function (funcProp) {
    let value = typeof funcProp == 'function' ? funcProp : (vall) => vall[funcProp]
    return this.reduce(function (acc, val) {
        (acc[value(val)] = acc[value(val)] || []).push(val);
        return acc;
    }, {});
};

exports.last = function () {
    return this[this.length - 1]
}

exports.intersection = function intersection(arr = []) {
    return _.intersection(this, arr)
}

exports.shuffle = function () {
    return _.shuffle(this)
}

exports.unique = function (key) {
    return _.uniq(this, key)
}

exports.difference = function (arr) {
    return _.difference(this, arr)
}

exports.wrap = function (idnty) {
    return _.wrap(this, idnty)
}
