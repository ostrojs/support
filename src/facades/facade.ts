import InvalidFacadeAccessor from './exceptions/invalidFacadeAccessor';
import RuntimeException from '../exceptions/runtimeException';
import { isset } from '../function';
import { ProxyHandler } from '../macro';

/**
 * Class Facade.
 */
class Facade {

    static $app = null;

    static $resolvedInstance = {};

    static $cached = true;

    /**
     * resolved method.
     * @static
     * @param {*} $callback
     * @returns {any}
     */
    static resolved($callback: Function) {
        let $accessor = this.getFacadeAccessor();

        if (this.$app.resolved($accessor) === true) {
            $callback(this.getFacadeRoot());
        }

        this.$app.afterResolving($accessor, function ($service) {
            $callback($service);
        });
    }

    /**
     * swap method.
     * @static
     * @param {*} $instance
     * @returns {any}
     */
    static swap($instance: any) {
        this.$resolvedInstance[this.getFacadeAccessor()] = $instance;

        if (this.$app && typeof this.$app.instance === 'function') {
            this.$app.instance(this.getFacadeAccessor(), $instance);
        }
    }

    /**
     * getFacadeRoot method.
     * @static
     * @returns {any}
     */
    static getFacadeRoot() {
        return this.resolveFacadeInstance(this.getFacadeAccessor());
    }

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor(): string {
        throw new RuntimeException('Facade does not implement getFacadeAccessor method.');
    }

    /**
     * resolveFacadeInstance method.
     * @static
     * @param {*} $name
     * @returns {any}
     */
    static resolveFacadeInstance($name: string) {
        if (typeof $name == 'object') {
            return $name;
        }

        if (isset(this.$resolvedInstance[$name])) {
            if (this.$cached) {
                return this.$resolvedInstance[$name];
            }
            return this.$app[$name];
        }

        if (this.$app) {
            return this.$resolvedInstance[$name] = this.$app[$name];
        }
    }

    /**
     * clearResolvedInstance method.
     * @static
     * @param {*} $name
     * @returns {any}
     */
    static clearResolvedInstance($name: string) {
        delete this.$resolvedInstance[$name];
    }

    /**
     * clearResolvedInstances method.
     * @static
     * @returns {any}
     */
    static clearResolvedInstances() {
        this.$resolvedInstance = {};
    }

    /**
     * getFacadeApplication method.
     * @static
     * @returns {any}
     */
    static getFacadeApplication() {
        return this.$app;
    }

    /**
     * setFacadeApplication method.
     * @static
     * @param {*} $app
     * @returns {any}
     */
    static setFacadeApplication($app: any) {
        this.$app = $app;
    }

    /**
     * _makeProxy method.
     * @static
     * @param {*} $instance
     * @param {*} $method
     * @returns {any}
     */
    static _makeProxy($instance: any, $method: string) {
        return ProxyHandler.make($instance, $method);
    }

    /**
     * __get method.
     * @static
     * @param {*} $target
     * @param {*} $method
     * @returns {any}
     */
    static __get($target: Record<string, any>, $method: string) {
        let $instance = $target.getFacadeRoot();

        if (!$instance) {
            throw new InvalidFacadeAccessor($target.getFacadeAccessor());
        }
        return Facade._makeProxy($instance, $method);
    }

}
export default Facade;
