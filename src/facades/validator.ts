import Facade from './facade';
import { Macroable } from '../macro';
/**
 * Class validator.
 */
class validator extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'validation';
    }
}
export default Macroable(validator);