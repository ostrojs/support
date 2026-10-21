import ServiceProvider from '../src/serviceProvider';
import DeferrableProvider from '../src/deferrableProvider';
import AggregateServiceProvider from '../src/aggregateServiceProvider';

describe('Service Providers', () => {
    describe('ServiceProvider', () => {
        test('instantiates with app and has default methods', () => {
            const mockApp = {};
            const sp = new ServiceProvider(mockApp);
            expect(sp.$app).toBe(mockApp);
            expect(sp.provides()).toEqual([]);
            expect(sp.isDeferred()).toBe(false);

            // Empty callbacks should not throw
            expect(() => sp.boot()).not.toThrow();
            expect(() => sp.register()).not.toThrow();
            expect(() => sp.callBootingCallbacks()).not.toThrow();
            expect(() => sp.callBootedCallbacks()).not.toThrow();
        });

        test('commands adds bootstraper to Assistant', () => {
            const mockAssistant = {
                addBootstraper: jest.fn((callback) => {
                    const mockArtisan = { resolveCommands: jest.fn() };
                    callback(mockArtisan);
                    expect(mockArtisan.resolveCommands).toHaveBeenCalled();
                })
            };

            jest.mock('@ostro/console/application', () => mockAssistant, { virtual: true });

            const sp = new ServiceProvider({});
            // Array of commands
            sp.commands(['command.one', 'command.two']);
            expect(mockAssistant.addBootstraper).toHaveBeenCalled();

            // Arguments list of commands
            sp.commands('command.three');

            // Empty commands
            sp.commands([]);
        });
    });

    describe('DeferrableProvider', () => {
        test('isDeferred returns true', () => {
            const dp = new DeferrableProvider({});
            expect(dp.isDeferred()).toBe(true);
        });
    });

    describe('AggregateServiceProvider', () => {
        test('getters and setters for $providers and $instances', () => {
            const asp = new AggregateServiceProvider({});
            expect(asp.$providers).toEqual([]);
            expect(asp.$instances).toEqual([]);

            asp.$providers = ['ProviderA', 'ProviderB'];
            expect(asp.$providers).toEqual(['ProviderA', 'ProviderB']);

            asp.$instances = ['InstanceA'];
            expect(asp.$instances).toEqual(['InstanceA']);
        });

        test('register registers all providers via $app.register', () => {
            const registered: any[] = [];
            const mockApp = {
                register: jest.fn((p) => {
                    registered.push(p);
                    return { provider: p };
                })
            };

            const asp = new AggregateServiceProvider(mockApp);
            asp.$providers = ['ProviderOne', 'ProviderTwo'];

            asp.register();
            expect(mockApp.register).toHaveBeenCalledTimes(2);
            expect(asp.$instances).toHaveLength(2);
        });

        test('provides aggregates provides from resolved provider instances', () => {
            const mockApp = {
                resolveProvider: jest.fn((p) => ({
                    provides: () => [p + '.service']
                }))
            };

            const asp = new AggregateServiceProvider(mockApp);
            asp.$providers = ['One', 'Two'];

            const combinedProvides = asp.provides();
            expect(combinedProvides).toEqual(['One.service', 'Two.service']);
        });
    });
});
