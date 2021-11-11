const Facade = require('./facade')
const { Macroable } = require('../macro')
class Config extends Facade {

    static getFacadeAccessor() {
        return 'config';
    }
}
module.exports = Macroable(Config)