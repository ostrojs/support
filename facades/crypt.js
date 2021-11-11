const Facade = require('./facade')
const { Macroable } = require('../macro')

class Crypt extends Facade {

    static getFacadeAccessor() {
        return 'encrypter';
    }
}
module.exports = Macroable(Crypt)