import Facade from './facade';
import { Macroable } from '../macro';
import DateFactory from '../dateTime';
import { isset } from '../function';
/**
 * Class DateTime.
 */
class DateTime extends Facade {

    /**
     * Get DEFAULT_FACADE.
     * @static
     * @returns {any}
     */
    static get DEFAULT_FACADE(){
        return DateFactory
    }

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'date';
    }

    /**
     * resolveFacadeInstance method.
     * @static
     * @param {*} $name
     * @returns {any}
     */
    static resolveFacadeInstance($name: string) {
        if (!isset(this.$resolvedInstance[$name]) && !isset(this.$app, this.$app[$name])) {
            let $class = this.DEFAULT_FACADE;
            this.swap(new $class);
        }

        return super.resolveFacadeInstance($name);
    }
}
export default Macroable(DateTime);
