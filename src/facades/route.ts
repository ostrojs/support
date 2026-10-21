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
        return (this.getFacadeRoot() as any).get(uri, action);
    }

    static post(uri: string, action?: any): any {
        return (this.getFacadeRoot() as any).post(uri, action);
    }

    static put(uri: string, action?: any): any {
        return (this.getFacadeRoot() as any).put(uri, action);
    }

    static patch(uri: string, action?: any): any {
        return (this.getFacadeRoot() as any).patch(uri, action);
    }

    static delete(uri: string, action?: any): any {
        return (this.getFacadeRoot() as any).delete(uri, action);
    }

    static options(uri: string, action?: any): any {
        return (this.getFacadeRoot() as any).options(uri, action);
    }

    static any(uri: string, action?: any): any {
        return (this.getFacadeRoot() as any).any(uri, action);
    }

    static match(methods: string[], uri: string, action?: any): any {
        return (this.getFacadeRoot() as any).match(methods, uri, action);
    }

    static prefix(prefix: string): any {
        return (this.getFacadeRoot() as any).prefix(prefix);
    }

    static middleware(...middlewares: any[]): any {
        return (this.getFacadeRoot() as any).middleware(...middlewares);
    }

    static namespace(namespace: string): any {
        return (this.getFacadeRoot() as any).namespace(namespace);
    }

    static group(callback: Function | string): any {
        return (this.getFacadeRoot() as any).group(callback);
    }
}
export default Macroable(Route);