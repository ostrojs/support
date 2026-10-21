/**
 * Class ServiceProvider.
 */
class ServiceProvider {
    public $app: any;

    /**
     * Create a new instance.
     * @param $app - Application container instance.
     */
    constructor($app: any) {
        this.$app = $app;
    }

    /**
     * Boot the service provider.
     */
    public boot(): void {
    }

    /**
     * Register services with the container.
     */
    public register(): void {
    }

    /**
     * Call booting callbacks.
     */
    public callBootingCallbacks(): void {
    }

    /**
     * Call booted callbacks.
     */
    public callBootedCallbacks(): void {
    }

    /**
     * Register console commands.
     * @param $commands - Command class or list of command classes.
     */
    public commands($commands: any): void {
        const commandList = Array.isArray($commands) ? $commands : Array.from(arguments);
        if (commandList.length) {
            const assistantModule = require('@ostro/console/application');
            const Assistant = assistantModule?.default || assistantModule;
            Assistant.addBootstraper(function ($artisan: any) {
                $artisan.resolveCommands(commandList);
            });
        }
    }

    /**
     * Get provided services.
     * @returns Array of provided service identifiers.
     */
    public provides(): string[] {
        return [];
    }

    /**
     * Determine if provider is deferred.
     * @returns True if deferred, false otherwise.
     */
    public isDeferred(): boolean {
        return false;
    }
}

export default ServiceProvider;