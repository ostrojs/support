const _Manager = require('../src/manager');
const Manager = _Manager.default || _Manager;
const _InvalidArgumentException = require('../src/exceptions/invalidArgumentException');
const InvalidArgumentException = _InvalidArgumentException.default || _InvalidArgumentException;

describe('Manager', () => {
    class TestManager extends Manager {
        get $type() {
            return 'cache';
        }

        createArrayDriver(config, name) {
            return {
                name: 'array',
                config,
                get: (key) => 'val_' + key
            };
        }
    }

    test('container initialization and defaults', () => {
        const mgr1 = new TestManager();
        expect(mgr1.getContainer()).toBeDefined();

        const customContainer = {
            make: (key) => ({ cache: { default: 'array', drivers: { array: { driver: 'array' } } } })
        };
        const mgr2 = new TestManager(customContainer);
        expect(mgr2.getContainer()).toBe(customContainer);
        expect(mgr2.getDefaultDriver()).toBe('array');

        mgr1.setContainer(customContainer);
        expect(mgr1.getContainer()).toBe(customContainer);
    });

    test('driver resolution with built-in method and caching', () => {
        const customContainer = {
            make: (key) => ({
                cache: {
                    default: 'array',
                    drivers: {
                        array: { driver: 'array' },
                        file: { driver: 'file' }
                    }
                }
            })
        };
        const mgr = new TestManager(customContainer);
        const drv1 = mgr.driver();
        expect(drv1.name).toBe('array');

        // cached driver returned
        const drv2 = mgr.driver('array');
        expect(drv2).toBe(drv1);
        expect(mgr.getDrivers()['array']).toBe(drv1);

        mgr.forgetDrivers();
        expect(mgr.getDrivers()).toEqual({});
    });

    test('driver resolution throws when default driver is null', () => {
        const mgr = new TestManager();
        expect(() => {
            mgr.driver();
        }).toThrow(InvalidArgumentException);
    });

    test('driver resolution throws for unsupported driver', () => {
        const customContainer = {
            make: (key) => ({
                cache: {
                    default: 'file',
                    drivers: {
                        file: { driver: 'file' }
                    }
                }
            })
        };
        const mgr = new TestManager(customContainer);
        expect(() => {
            mgr.driver('file');
        }).toThrow("Driver [file] not supported.");
    });

    test('custom driver creator via extend()', () => {
        const customContainer = {
            make: (key) => ({
                cache: {
                    default: 'custom',
                    drivers: {
                        custom: { driver: 'custom_driver' }
                    }
                }
            })
        };
        const mgr = new TestManager(customContainer);
        mgr.extend('custom_driver', (container, name, config) => {
            return {
                name: 'custom_created',
                config
            };
        });

        const drv = mgr.driver('custom');
        expect(drv.name).toBe('custom_created');
    });

    test('setDefaultDriver, getConfig, getDriverConfig', () => {
        const mgr = new TestManager();
        mgr.setDefaultDriver('redis');
        expect(mgr.getDefaultDriver()).toBe('redis');

        expect(mgr.getConfig('default')).toBe('redis');
        expect(mgr.getConfig('missing', 'fallback')).toBe('fallback');
        expect(mgr.getDriverConfig('redis')).toBeUndefined();
    });

    test('__call dynamic method proxy to default driver', () => {
        const customContainer = {
            make: (key) => ({
                cache: {
                    default: 'array',
                    drivers: {
                        array: { driver: 'array' }
                    }
                }
            })
        };
        const mgr = new TestManager(customContainer);
        const res = mgr.__call(mgr, 'get', ['mykey']);
        expect(res).toBe('val_mykey');
    });
});
