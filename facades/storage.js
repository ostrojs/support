const Facade = require('./facade')
const { Macroable } = require('../macro')
class Storage extends Facade {

    static getFacadeAccessor() {
        return 'filesystem';
    }
}
module.exports = Macroable(Storage)