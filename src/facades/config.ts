import Facade from './facade';
import { Macroable } from '../macro';
/**
 * Class Config.
 */
class Config extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'config';
    }
}
export default Macroable(Config);