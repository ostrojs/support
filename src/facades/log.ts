import Facade from './facade';
import { Macroable } from '../macro';
/**
 * Class Logger.
 */
class Logger extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'logger';
    }
}
export default Macroable(Logger);