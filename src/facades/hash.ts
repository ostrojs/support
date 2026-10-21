import Facade from './facade';
import { Macroable } from '../macro';

/**
 * Class Hash.
 */
class Hash extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'hash';
    }
}
export default Macroable(Hash) as typeof Hash & { [key: string]: any };