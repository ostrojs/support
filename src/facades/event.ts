import Facade from './facade';
import { Macroable } from '../macro';
/**
 * Class Event.
 */
class Event extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'event';
    }
}
export default Macroable(Event);