const { Macroable } = require('./macro')
const InvalidArgumentException = require('./exceptions/invalidArgumentException')

class Manager extends Macroable {

    constructor(application) {
        super()
        let $container = application || app()
        Object.defineProperties(this, {
            '$container': {
                value: $container,
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

    resolve($driver, $config = {}) {
        if (isset(this.$customCreators[$driver])) {
            return this.callCustomCreator($driver);
        } else {
            let $method = 'create' + String.pascal($driver) + 'Driver';

            if (method_exists(this, $method)) {
                return this[$method]($config);
            }
        }

        throw new InvalidArgumentException("Driver [" + $driver + "] not supported.");
    }

    callCustomCreator($driver) {
        return this.$customCreators[$driver].call(this, this.$container, $driver, this.$config);
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
        this.$config.get(`${this.$type}.default`, name);
    }

    getDefaultDriver() {
        return this.$config.get(`${this.$type}.default`);
    }

    __get(target, $method, ) {
        return this.make(target.driver(), $method);
    }
}

module.exports = Manager