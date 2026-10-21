import Facade from './facade';
import { Macroable } from '../macro';

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
        return (this as any).make($target.$app, $method);
    }
}

export default Macroable(Application);