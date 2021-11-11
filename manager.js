const { Macroable } = require('./macro')
const InvalidArgumentException = require('./exceptions/invalidArgumentException')
const kContainer = Symbol('container')
const kConfig = Symbol('config')
const kCustomCreators = Symbol('customCreators')
const kDrivers = Symbol('drivers')
class Manager extends Macroable {

    constructor() {
        super()
        let $container = app()
        Object.defineProperties(this, {
            '$container': {
                value: $container,
            },
            '$config':{
                value:$container.make('config')
            },
            '$customCreators':{
                value:{},
                writable:true
            },
            '$drivers':{
                value:{},
                writable:true
            }
        })
    }

    driver($driver = null) {
        $driver = $driver || this.getDefaultDriver();

        if (is_null($driver)) {
            throw new InvalidArgumentException(`Unable to resolve NULL driver for [${this.constructor.name}].`);
        }

        if (!isset(this.$drivers[$driver])) {
            this.$drivers[$driver] = this.createDriver($driver);
        }

        return this.$drivers[$driver];
    }

    createDriver($driver) {

        if (isset(this.$customCreators[$driver])) {
            return this.callCustomCreator($driver);
        } else {
            let $method = 'create' + String.pascal($driver) + 'Driver';

            if (method_exists(this, $method)) {
                return this[$method]();
            }
        }

        throw new InvalidArgumentException("Driver ["+$driver+"] not supported.");
    }

    callCustomCreator($driver) {
        return this.$customCreators[$driver](this.$container);
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

    __get(target, $method,) {
        return this.make(target.driver(), $method);
    }
}

module.exports = Manager