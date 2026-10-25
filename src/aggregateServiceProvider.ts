import ServiceProvider from './serviceProvider';

/**
 * Class AggregateServiceProvider.
 */
class AggregateServiceProvider extends ServiceProvider {
    #providers?: any[];
    #instances?: any[];

    public get $providers(): any[] {
        return this.#providers = this.#providers || [];
    }

    public get $instances(): any[] {
        return this.#instances = this.#instances || [];
    }

    public set $providers(value: any[]) {
        this.#providers = value;
    }

    public set $instances(value: any[]) {
        this.#instances = value;
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