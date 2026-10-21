import Facade from './facade';
import { Macroable } from '../macro';
/**
 * Class Assistant.
 */
class Assistant extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return '@ostro/contracts/console/kernel';
    }
}

export default Macroable(Assistant);
