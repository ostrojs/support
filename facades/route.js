const Facade = require('./facade')
const { Macroable } = require('../macro')
class Route extends Facade {

    static getFacadeAccessor() {
        return 'router';
    }
}
module.exports = Macroable(Route)