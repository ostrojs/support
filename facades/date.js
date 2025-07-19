const Facade = require('./facade')
const { Macroable } = require('../macro')
const DateFactory = require('../dateTime')
class DateTime extends Facade {

    static get DEFAULT_FACADE(){
        return DateFactory
    }

    static getFacadeAccessor() {
        return 'date';
    }

    static resolveFacadeInstance($name) {
        if (!isset(this.$resolvedInstance[$name]) && !isset(this.$app, this.$app[$name])) {
            let $class = this.DEFAULT_FACADE;
            this.swap(new $class);
        }

        return super.resolveFacadeInstance($name);
    }
}
module.exports = Macroable(DateTime)
