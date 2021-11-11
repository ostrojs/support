const Facade = require('./facade')
const { Macroable } = require('../macro')
class Exception extends Facade {

    static getFacadeAccessor() {
        return 'exceptionHandler';
    }
}
module.exports = Macroable(Exception)