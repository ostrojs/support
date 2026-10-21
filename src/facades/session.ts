import Facade from './facade';
import { Macroable } from '../macro';
/**
 * Class Session.
 */
class Session extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'session';
    }
}
export default Macroable(Session);