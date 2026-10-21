import Facade from './facade';
import { Macroable } from '../macro';
import type { Blueprint } from '@ostro/contracts/database/blueprint';

/**
 * Class Schema.
 */
class Schema extends Facade {

    static $cached = false;

    /**
     * connection method.
     * @static
     * @param {*} $name
     * @returns {any}
     */
    static connection($name: string) {
        return this.$app['db'].connection($name).getSchemaBuilder();
    }

    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    static getFacadeAccessor() {
        return 'db.schema';
    }

    static create(table: string, callback: (table: Blueprint) => void): Promise<any> {
        return (this.getFacadeRoot() as any).create(table, callback);
    }

    static drop(table: string): Promise<any> {
        return (this.getFacadeRoot() as any).drop(table);
    }

    static dropIfExists(table: string): Promise<any> {
        return (this.getFacadeRoot() as any).dropIfExists(table);
    }

    static hasTable(table: string): Promise<boolean> {
        return (this.getFacadeRoot() as any).hasTable(table);
    }

    static hasColumn(table: string, column: string): Promise<boolean> {
        return (this.getFacadeRoot() as any).hasColumn(table, column);
    }

    static table(table: string, callback: (table: Blueprint) => void): Promise<any> {
        return (this.getFacadeRoot() as any).table(table, callback);
    }
}
export default Macroable(Schema);
