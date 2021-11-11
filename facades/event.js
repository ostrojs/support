const Facade = require('./facade')
const { Macroable } = require('../macro')
class Event extends Facade {

    static getFacadeAccessor() {
        return 'event';
    }
}
module.exports = Macroable(Event)