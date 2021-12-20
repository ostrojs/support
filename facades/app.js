const Facade = require('./facade')
const { Macroable } = require('../macro')

class Application extends Facade {

    static __get($target, $method) {
        return this.make($target.$app,$method);
    }
}

module.exports = Macroable(Application)