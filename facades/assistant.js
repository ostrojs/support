const Facade = require('./facade')
const { Macroable } = require('../macro')
class Assistant extends Facade {

    static getFacadeAccessor() {
        return '@ostro/contracts/console/kernel';
    }
}

module.exports = Macroable(Assistant)
