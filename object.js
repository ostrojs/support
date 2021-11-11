const _ = require('lodash')

Object.filter = function(obj, cb) {
    let keys = Object.keys(obj)
    for (let key of keys) {
        let data = (typeof cb == 'function' ? cb(obj[key]) : obj[key])
        if (!data) {
            delete obj[key]
        }
    }
    return obj
}

Object.except = function(obj, keys) {
    var target = {};
    for (var i in obj) {
        if (keys.indexOf(i) >= 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
    }
    return target;
}

Object.flip = function flip(obj) {
    return _.transform(obj, function(res, val, key) {
        if (_.isPlainObject(val)) {
            res[key] = deepInvert(val);
        } else {
            res[val] = key;
        }
    });
}