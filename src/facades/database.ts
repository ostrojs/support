import Facade from './facade';
import { Macroable } from '../macro';
/**
 * Class Database.
 */
class Database extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'db';
    }
}
export default Macroable(Database) as typeof Database & { [key: string]: any };