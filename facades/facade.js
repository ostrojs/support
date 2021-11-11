const InvalidFacadeAccessor = require('./exceptions/invalidFacadeAccessor')
const RuntimeException = require('../exceptions/runtimeException')
const kApp = Symbol('app')
const kResolvedInstance = Symbol('resolvedInstance')
class Facade {

    static get $app() {
        return this[kApp] || null
    };

    static get $resolvedInstance() {
        return this[kResolvedInstance] = this[kResolvedInstance] || {}
    };

    static set $app(value) {
        return this[kApp] = value
    };

    static set $resolvedInstance(value) {
        return this[kResolvedInstance] = value
    };

    static resolved($callback) {
        let $accessor = this.getFacadeAccessor();

        if (this.$app.resolved($accessor) === true) {
            $callback(this.getFacadeRoot());
        }

        this.$app.afterResolving($accessor, function($service) {
            $callback($service);
        });
    }

    static swap($instance) {
        this.$resolvedInstance[this.getFacadeAccessor()] = $instance;

        if (isset(this.$app)) {
            this.$app.instance(this.getFacadeAccessor(), $instance);
        }
    }

    static getFacadeRoot() {
        return this.resolveFacadeInstance(this.getFacadeAccessor());
    }

    static getFacadeAccessor() {
        throw new RuntimeException('Facade does not implement getFacadeAccessor method.');
    }

    static resolveFacadeInstance($name) {
        if (typeof $name == 'object') {
            return $name;
        }

        if (isset(this.$resolvedInstance[$name])) {
            return this.$resolvedInstance[$name];
        }

        if (this.$app) {
            return this.$resolvedInstance[$name] = this.$app[$name];
        }
    }

    static clearResolvedInstance($name) {
        delete this.$resolvedInstance[$name];
    }

    static clearResolvedInstances() {
        this.$resolvedInstance = [];
    }

    static getFacadeApplication() {
        return this.$app;
    }

    static setFacadeApplication($app) {
        this.$app = $app;
    }

    static __call($target, $method, $args) {
        let $instance = $target.getFacadeRoot();

        if (!$instance) {
            throw new InvalidFacadeAccessor($target.getFacadeAccessor());
        }

        return $instance[$method](...$args);
    }

}
module.exports = Facade;