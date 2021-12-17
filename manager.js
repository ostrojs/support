const { Macroable } = require('./macro')
const InvalidArgumentException = require('./exceptions/invalidArgumentException')
const lodash = require('lodash')
class Manager extends Macroable {

    constructor(application) {
        super()
        let $container = application || app()
        Object.defineProperties(this, {
            '$container': {
                value: $container,
                writable: true
            },
            '$config': {
                value: $container.make('config'),
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
        })
    }

    driver($driver = null) {
        $driver = $driver || this.getDefaultDriver();

        if (is_null($driver)) {
            throw new InvalidArgumentException(`Unable to resolve NULL driver for [${this.constructor.name}].`);
        }

        if (!isset(this.$drivers[$driver])) {
            this.$drivers[$driver] = this.getDriver($driver);
        }

        return this.$drivers[$driver];
    }

    getDriver(name) {
        return this.resolve(name);
    }

    resolve($name, $config = {}) {

        if (isset(this.$customCreators[$config['driver']])) {
            return this.callCustomCreator($config, $name);
        }

        let $driverMethod = 'create' + String.pascal($config['driver']) + 'Driver';

        if (method_exists(this, $driverMethod)) {
            return this[$driverMethod]($config, $name);
        }

        throw new InvalidArgumentException("Driver [" + $config['driver'] + "] not supported.");
    }

    callCustomCreator($config, $name) {
        return this.$customCreators[$config['driver']].call(this, this.$container, $name, $config );
    }

    extend($driver, $callback) {
        this.$customCreators[$driver] = $callback;
        return this;
    }

    getDrivers() {
        return this.$drivers;
    }

    getContainer() {
        return this.$container;
    }

    setContainer($container) {
        this.$container = $container;
        return this;
    }

    forgetDrivers() {
        this.$drivers = {};
        return this;
    }

    setDefaultDriver(name) {
        lodash.set(this.$config,`${this.$type}.default`,name)
    }

    getDefaultDriver() {
        return this.getConfig('default');
    }

    getConfig(name,defaultValue) {
        return lodash.get(this.$config,`${this.$type}.${name}`, defaultValue)
    }

    __get(target, $method) {
        return this.make(target.driver(), $method);
    }
}

module.exports = Manager