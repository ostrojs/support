const Facade = require('./facade')
const { Macroable } = require('../macro')
class Cache extends Facade {

    static getFacadeAccessor() {
        return 'mailer';
    }
}
module.exports = Macroable(Cache)