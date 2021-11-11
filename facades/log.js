const Facade = require('./facade')
const { Macroable } = require('../macro')
class Logger extends Facade {

    static getFacadeAccessor() {
        return 'logger';
    }
}
module.exports = Macroable(Logger)