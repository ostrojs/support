import Facade from './facade';
import { Macroable } from '../macro';

/**
 * Class Route.
 */
class Route extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'router';
    }

    static get(uri: string, action?: any): any {
        return this.getFacadeRoot().get(uri, action);
    }

    static post(uri: string, action?: any): any {
        return this.getFacadeRoot().post(uri, action);
    }

    static put(uri: string, action?: any): any {
        return this.getFacadeRoot().put(uri, action);
    }

    static patch(uri: string, action?: any): any {
        return this.getFacadeRoot().patch(uri, action);
    }

    static delete(uri: string, action?: any): any {
        return this.getFacadeRoot().delete(uri, action);
    }

    static options(uri: string, action?: any): any {
        return this.getFacadeRoot().options(uri, action);
    }

    static any(uri: string, action?: any): any {
        return this.getFacadeRoot().any(uri, action);
    }

    static match(methods: string[], uri: string, action?: any): any {
        return this.getFacadeRoot().match(methods, uri, action);
    }

    static prefix(prefix: string): any {
        return this.getFacadeRoot().prefix(prefix);
    }

    static middleware(...middlewares: any[]): any {
        return this.getFacadeRoot().middleware(...middlewares);
    }

    static namespace(namespace: string): any {
        return this.getFacadeRoot().namespace(namespace);
    }

    static group(callback: Function | string): any {
        return this.getFacadeRoot().group(callback);
    }
}
export default Macroable(Route);