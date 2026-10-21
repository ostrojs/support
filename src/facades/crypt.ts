import Facade from './facade';
import { Macroable } from '../macro';

/**
 * Class Crypt.
 */
class Crypt extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'encrypter';
    }
}
export default Macroable(Crypt);