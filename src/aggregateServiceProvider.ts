import ServiceProvider from './serviceProvider';

const kProvders: unique symbol = Symbol('providers');
const kInstances: unique symbol = Symbol('instances');

/**
 * Class AggregateServiceProvider.
 */
class AggregateServiceProvider extends ServiceProvider {
    [kProvders]?: any[];
    [kInstances]?: any[];

    public get $providers(): any[] {
        return this[kProvders] = this[kProvders] || [];
    }

    public get $instances(): any[] {
        return this[kInstances] = this[kInstances] || [];
    }

    public set $providers(value: any[]) {
        this[kProvders] = value;
    }

    public set $instances(value: any[]) {
        this[kInstances] = value;
    }

    /**
     * Register aggregate providers.
     */
    public override register(): void {
        this.$instances = [];
        for (const $provider of this.$providers) {
            this.$instances.push(this.$app.register($provider));
        }
    }

    /**
     * Get aggregate provides.
     *
     * @returns Array of provided services.
     */
    public override provides(): string[] {
        let $provides: string[] = [];

        for (const $provider of this.$providers) {
            const $instance = this.$app.resolveProvider($provider);
            $provides = $provides.concat($instance.provides());
        }

        return $provides;
    }
}

export default AggregateServiceProvider;