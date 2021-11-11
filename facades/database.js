const Facade = require('./facade')
const { Macroable } = require('../macro')
class Database extends Facade {

    static getFacadeAccessor() {
        return 'db';
    }
}
module.exports = Macroable(Database)