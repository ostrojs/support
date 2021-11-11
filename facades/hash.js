const Facade = require('./facade')
const { Macroable } = require('../macro')

class Hash extends Facade {

    static getFacadeAccessor() {
        return 'hash';
    }
}
module.exports = Macroable(Hash)