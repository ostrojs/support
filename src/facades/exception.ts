import Facade from './facade';
import { Macroable } from '../macro';
/**
 * Class Exception.
 */
class Exception extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'exceptionHandler';
    }
}
export default Macroable(Exception);