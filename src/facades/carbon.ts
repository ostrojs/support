import Facade from './facade';
import { Macroable } from '../macro';
/**
 * Class Carbon.
 */
class Carbon extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'carbon';
    }
}
export default Macroable(Carbon);