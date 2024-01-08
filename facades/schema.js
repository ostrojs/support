const Facade = require('./facade')
const { Macroable } = require('../macro')
class Schema extends Facade {

    static $cached = false;

    static connection($name) {
        return this.$app['db'].connection($name).getSchemaBuilder();
    }

    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    static getFacadeAccessor() {
        return 'db.schema';
    }

}
module.exports = Macroable(Schema)
