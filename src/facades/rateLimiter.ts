import Facade from './facade';
import { Macroable } from '../macro';
/**
 * Class RateLimiter.
 */
class RateLimiter extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return require('@ostro/cache/rateLimiter');
    }
}
export default Macroable(RateLimiter);
