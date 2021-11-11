const Facade = require('./facade')
const { Macroable } = require('../macro')
class Carbon extends Facade {

    static getFacadeAccessor() {
        return 'carbon';
    }
}
module.exports = Macroable(Carbon)