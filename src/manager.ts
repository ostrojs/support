import { Macroable } from './macro';
import InvalidArgumentException from './exceptions/invalidArgumentException';
import lodash from 'lodash';
import * as StringHelper from './string';
import { is_null, isset, method_exists } from './function';
import MockContainer from './mockContainer';
import type { IConfig } from '@ostro/contracts/config/repository';

/**
 * Class Manager.
 */
class Manager extends Macroable {
    protected $container: any;
    protected $config: IConfig | Record<string, any>;
    protected $customCreators: Record<string, Function>;
    protected $drivers: Record<string, any>;
    declare public $type: string;

    /**
     * Create a new instance.
     * @param application - Application container instance.
     */
    constructor(application?: any) {
        super();
        const $container = application || (typeof (globalThis as typeof globalThis).app === 'function' ? (globalThis as typeof globalThis).app() : new MockContainer());
        Object.defineProperties(this, {
            '$container': {
                value: $container,
                writable: true
            },
            '$config': {
                value: (typeof $container.make === 'function' ? ($container.make('config') as IConfig) : {}) || {},
                writable: true
            },
            '$customCreators': {
                value: {},
                writable: true
            },
            '$drivers': {
                value: {},
                writable: true
            }
        });
    }

    /**
     * Get a driver instance.
     *
     * @param $driver - Driver name.
     * @returns Driver instance.
     */
    public driver($driver: string | null = null): any {
        $driver = $driver || this.getDefaultDriver();

        if (is_null($driver)) {
            throw new InvalidArgumentException(`Unable to resolve NULL driver for [${this.constructor.name}].`);
        }

        if (!isset(this.$drivers[$driver])) {
            this.$drivers[$driver] = this.getDriver($driver);
        }

        return this.$drivers[$driver];
    }

    /**
     * Get driver instance by name.
     *
     * @param name - Driver name.
     * @returns Resolved driver instance.
     */
    public getDriver(name: string): any {
        const $config = this.getDriverConfig(name);
        return this.resolve(name, $config);
    }

    /**
     * Resolve the given driver.
     *
     * @param $name - Driver name.
     * @param $config - Driver configuration.
     * @returns Resolved driver instance.
     */
    protected resolve($name: string, $config: any = {}): any {
        if (isset(this.$customCreators[$config['driver']])) {
            return this.callCustomCreator($config, $name);
        }

        const $driverMethod = 'create' + StringHelper.pascal($config['driver']) + 'Driver';

        if (method_exists(this, $driverMethod)) {
            return (this as Record<string, Function>)[$driverMethod]($config, $name);
        }

        throw new InvalidArgumentException("Driver [" + $config['driver'] + "] not supported.");
    }

    /**
     * Call custom driver creator callback.
     *
     * @param $config - Driver config.
     * @param $name - Driver name.
     * @returns Driver instance.
     */
    protected callCustomCreator($config: any, $name: string): any {
        return this.$customCreators[$config['driver']].call(this, this.$container, $name, $config);
    }

    /**
     * Register a custom driver creator.
     *
     * @param $driver - Driver name.
     * @param $callback - Creator callback.
     * @returns Current manager instance.
     */
    public extend($driver: string, $callback: Function): this {
        this.$customCreators[$driver] = $callback;
        return this;
    }

    /**
     * Get all resolved drivers.
     *
     * @returns Drivers map.
     */
    public getDrivers(): Record<string, any> {
        return this.$drivers;
    }

    /**
     * Get the container instance.
     *
     * @returns Container instance.
     */
    public getContainer(): any {
        return this.$container;
    }

    /**
     * Set the container instance.
     *
     * @param $container - Container instance.
     * @returns Current manager instance.
     */
    public setContainer($container: any): this {
        this.$container = $container;
        return this;
    }

    /**
     * Clear all resolved drivers.
     *
     * @returns Current manager instance.
     */
    public forgetDrivers(): this {
        this.$drivers = {};
        return this;
    }

    /**
     * Set default driver name.
     *
     * @param name - Default driver name.
     */
    public setDefaultDriver(name: string): void {
        lodash.set(this.$config, `${this.$type}.default`, name);
    }

    /**
     * Get default driver name.
     *
     * @returns Default driver name.
     */
    public getDefaultDriver(): string {
        return lodash.get(this.$config, `${this.$type}.default`);
    }

    /**
     * Get configuration value.
     *
     * @param name - Configuration key.
     * @param defaultValue - Fallback value.
     * @returns Configuration value.
     */
    public getConfig(name: string, defaultValue?: any): any {
        return lodash.get(this.$config, `${this.$type}.${name}`, defaultValue);
    }

    /**
     * Get driver configuration.
     *
     * @param name - Driver name.
     * @returns Driver configuration.
     */
    public getDriverConfig(name: string): any {
        return lodash.get(this.$config, `${this.$type}.drivers.${name}`);
    }

    /**
     * Magic call proxy method.
     *
     * @param target - Target object.
     * @param $method - Method name.
     * @param $parameters - Call parameters.
     * @returns Result of method call on default driver.
     */
    public __call(target: any, $method: string, $parameters: any[]): any {
        return target.driver()[$method](...$parameters);
    }
}

export default Manager;
