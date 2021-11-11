const ServiceProvider = require('./serviceProvider')
const kProvders = Symbol('providers')
const kInstances = Symbol('instances')
class AggregateServiceProvider extends ServiceProvider
{

    get $providers(){
        return this[kProvders] = this[kProvders] || []
    };

    get $instances(){
        return this[kInstances] = this[kInstances] || []
    };

    set $providers(value){
        return this[kProvders] = value
    };

    set $instances(value){
        return this[kInstances] = value
    };

    register()
    {

        this.$instances = [];
        for (let $provider of this.$providers) {
            this.$instances.push(this.$app.register($provider))
        }
    }

    provides()
    {

        let $provides = [];

        for (let $provider of this.$providers) {

            let $instance = this.$app.resolveProvider($provider);

            $provides = $provides.concat($instance.provides());
        }

        return $provides;
    }

}

module.exports = AggregateServiceProvider