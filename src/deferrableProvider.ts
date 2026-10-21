import ServiceProvider from './serviceProvider';

/**
 * Class DeferrableProvider.
 */
class DeferrableProvider extends ServiceProvider {
    /**
     * Determine if provider is deferred.
     *
     * @returns True if deferred.
     */
    public override isDeferred(): boolean {
        return true;
    }
}

export default DeferrableProvider;