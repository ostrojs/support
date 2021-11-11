const Facade = require('./facade')
const { Macroable } = require('../macro')
class Session extends Facade {

    static getFacadeAccessor() {
        return 'session';
    }
}
module.exports = Macroable(Session)