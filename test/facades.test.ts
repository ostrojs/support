import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
jest.mock('@ostro/cache/rateLimiter', () => ({ default: class MockRateLimiter {} }), { virtual: true });

const _Facade = require('../src/facades/facade');
const Facade = _Facade.default || _Facade;
const _AppFacade = require('../src/facades/app');
const AppFacade = _AppFacade.default || _AppFacade;
const _CacheFacade = require('../src/facades/cache');
const CacheFacade = _CacheFacade.default || _CacheFacade;
const _DateFacade = require('../src/facades/date');
const DateFacade = _DateFacade.default || _DateFacade;
const _SchemaFacade = require('../src/facades/schema');
const SchemaFacade = _SchemaFacade.default || _SchemaFacade;
const _AssistantFacade = require('../src/facades/assistant');
const AssistantFacade = _AssistantFacade.default || _AssistantFacade;
const _CarbonFacade = require('../src/facades/carbon');
const CarbonFacade = _CarbonFacade.default || _CarbonFacade;
const _ConfigFacade = require('../src/facades/config');
const ConfigFacade = _ConfigFacade.default || _ConfigFacade;
const _CryptFacade = require('../src/facades/crypt');
const CryptFacade = _CryptFacade.default || _CryptFacade;
const _DatabaseFacade = require('../src/facades/database');
const DatabaseFacade = _DatabaseFacade.default || _DatabaseFacade;
const _EventFacade = require('../src/facades/event');
const EventFacade = _EventFacade.default || _EventFacade;
const _ExceptionFacade = require('../src/facades/exception');
const ExceptionFacade = _ExceptionFacade.default || _ExceptionFacade;
const _HashFacade = require('../src/facades/hash');
const HashFacade = _HashFacade.default || _HashFacade;
const _LogFacade = require('../src/facades/log');
const LogFacade = _LogFacade.default || _LogFacade;
const _MailFacade = require('../src/facades/mail');
const MailFacade = _MailFacade.default || _MailFacade;
const _RateLimiterFacade = require('../src/facades/rateLimiter');
const RateLimiterFacade = _RateLimiterFacade.default || _RateLimiterFacade;
const _RouteFacade = require('../src/facades/route');
const RouteFacade = _RouteFacade.default || _RouteFacade;
const _SessionFacade = require('../src/facades/session');
const SessionFacade = _SessionFacade.default || _SessionFacade;
const _StorageFacade = require('../src/facades/storage');
const StorageFacade = _StorageFacade.default || _StorageFacade;
const _ValidatorFacade = require('../src/facades/validator');
const ValidatorFacade = _ValidatorFacade.default || _ValidatorFacade;

const _InvalidFacadeAccessor = require('../src/facades/exceptions/invalidFacadeAccessor');
const InvalidFacadeAccessor = _InvalidFacadeAccessor.default || _InvalidFacadeAccessor;
const _RuntimeException = require('../src/exceptions/runtimeException');
const RuntimeException = _RuntimeException.default || _RuntimeException;

describe('Facades', () => {
    let mockApp;

    beforeEach(() => {
        mockApp = {
            cache: {
                get: jest.fn((k) => 'cached_' + k),
                set: jest.fn()
            },
            date: {
                now: jest.fn(() => 'now_date')
            },
            db: {
                connection: jest.fn(() => ({
                    getSchemaBuilder: () => 'schema_builder'
                }))
            },
            'db.schema': {
                hasTable: jest.fn(() => true)
            },
            instance: jest.fn((key, inst) => {
                mockApp[key] = inst;
            }),
            resolved: jest.fn((accessor) => true),
            afterResolving: jest.fn((accessor, cb) => {
                cb(mockApp[accessor]);
            })
        };
        Facade.setFacadeApplication(mockApp);
        Facade.clearResolvedInstances();
    });

    afterEach(() => {
        Facade.clearResolvedInstances();
        Facade.setFacadeApplication(null);
    });

    test('getFacadeAccessor base throws RuntimeException', () => {
        expect(() => {
            Facade.getFacadeAccessor();
        }).toThrow(RuntimeException);
    });

    test('Facade application getter and setter', () => {
        expect(Facade.getFacadeApplication()).toBe(mockApp);
    });

    test('calls resolved callbacks', () => {
        const cb = jest.fn();
        CacheFacade.resolved(cb);
        expect(cb).toHaveBeenCalled();
    });

    test('resolved callback when not yet resolved', () => {
        mockApp.resolved = jest.fn(() => false);
        const cb = jest.fn();
        CacheFacade.resolved(cb);
        expect(cb).toHaveBeenCalledWith(mockApp.cache);
    });

    test('swap and clearResolvedInstance', () => {
        const dummyCache = { get: () => 'swapped' };
        CacheFacade.swap(dummyCache);
        expect(CacheFacade.get('key')).toBe('swapped');

        mockApp.cache = { get: (k) => 'cached_' + k };
        CacheFacade.clearResolvedInstance('cache');
        expect(CacheFacade.get('key')).toBe('cached_key');
    });

    test('resolveFacadeInstance with object or non-cached flag', () => {
        const directObj = { test: 123 };
        expect(Facade.resolveFacadeInstance(directObj)).toBe(directObj);

        // test $cached = false
        class NonCachedFacade extends Facade {
            static $cached = false;
            static getFacadeAccessor() {
                return 'cache';
            }
        }
        NonCachedFacade.resolveFacadeInstance('cache');
        // second call with $cached = false
        const instance = NonCachedFacade.resolveFacadeInstance('cache');
        expect(instance).toBe(mockApp.cache);
    });

    test('InvalidFacadeAccessor thrown when root is null', () => {
        class BrokenFacade extends Facade {
            static getFacadeAccessor() {
                return 'non_existent_service';
            }
        }
        const WrappedBroken = require('../src/macro').Macroable(BrokenFacade);
        expect(() => {
            WrappedBroken.someMethod();
        }).toThrow(InvalidFacadeAccessor);
    });

    test('AppFacade __get proxies to $app', () => {
        mockApp.testMethod = jest.fn(() => 'app_ok');
        expect(AppFacade.testMethod()).toBe('app_ok');
    });

    test('DateFacade default fallback when not set in app', () => {
        Facade.setFacadeApplication({});
        Facade.clearResolvedInstances();
        expect(DateFacade.now).toBeDefined();
    });

    test('SchemaFacade connection method', () => {
        expect(SchemaFacade.connection('mysql')).toBe('schema_builder');
    });

    test('All other facade accessors', () => {
        expect(AssistantFacade.getFacadeAccessor()).toBe('@ostro/contracts/console/kernel');
        expect(CarbonFacade.getFacadeAccessor()).toBe('carbon');
        expect(ConfigFacade.getFacadeAccessor()).toBe('config');
        expect(CryptFacade.getFacadeAccessor()).toBe('encrypter');
        expect(DatabaseFacade.getFacadeAccessor()).toBe('db');
        expect(EventFacade.getFacadeAccessor()).toBe('event');
        expect(ExceptionFacade.getFacadeAccessor()).toBe('exceptionHandler');
        expect(HashFacade.getFacadeAccessor()).toBe('hash');
        expect(LogFacade.getFacadeAccessor()).toBe('logger');
        expect(MailFacade.getFacadeAccessor()).toBe('mailer');
        expect(RateLimiterFacade.getFacadeAccessor()).toBeDefined();
        expect(RouteFacade.getFacadeAccessor()).toBe('router');
        expect(SchemaFacade.getFacadeAccessor()).toBe('db.schema');
        expect(SessionFacade.getFacadeAccessor()).toBe('session');
        expect(StorageFacade.getFacadeAccessor()).toBe('filesystem');
        expect(ValidatorFacade.getFacadeAccessor()).toBe('validation');
    });

    test('InvalidFacadeAccessor exception properties', () => {
        const err = new InvalidFacadeAccessor('custom');
        expect(err.name).toBe('InvalidFacadeAccessor');
        expect(err.status).toBe(500);
        expect(err.message).toContain('custom');
    });
});
