import Facade from './facade';
import { Macroable } from '../macro';
/**
 * Class Storage.
 */
class Storage extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'filesystem';
    }
}
export default Macroable(Storage);