const Facade = require('./facade')
const { Macroable } = require('../macro')
class Cache extends Facade {

    static getFacadeAccessor() {
        return 'cache';
    }
}
module.exports = Macroable(Cache)