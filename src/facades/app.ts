import Facade from './facade';
import { Macroable, ProxyHandler } from '../macro';

/**
 * Class Application.
 */
class Application extends Facade {

    /**
     * __get method.
     * @static
     * @param {*} $target
     * @param {*} $method
     * @returns {any}
     */
    static __get($target: Record<string, any>, $method: string) {
        return ProxyHandler.make($target.$app, $method);
    }
}

export default Macroable(Application);