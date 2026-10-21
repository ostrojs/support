import Facade from './facade';
import { Macroable } from '../macro';
/**
 * Class Cache.
 */
class Cache extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'mailer';
    }
}
export default Macroable(Cache);