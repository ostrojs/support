const Facade = require('./facade')
const { Macroable } = require('../macro')
class validator extends Facade {

    static getFacadeAccessor() {
        return 'validation';
    }
}
module.exports = Macroable(validator)