import { describe, test, expect } from '@jest/globals';
import MockContainer from '../src/mockContainer';
import { Macroable } from '../src/macro';

describe('MockContainer and Macroable', () => {
    describe('MockContainer', () => {
        test('bind and make resolve bindings', () => {
            const container = new MockContainer();
            container.bind('singleton', (app) => ({ app, resolved: true }));
            container.bind('value', 42);

            const result1 = container.make('singleton');
            expect(result1.resolved).toBe(true);
            expect(result1.app).toBe(container);

            const result2 = container.make('value');
            expect(result2).toBe(42);

            // make unbound returns empty object
            expect(container.make('unbound')).toEqual({});
        });
    });

    describe('Macroable', () => {
        test('wraps class in proxy and attaches macro and getter methods', () => {
            class BaseClass {
                constructor(val) {
                    this.val = val;
                }
            }

            const ProxiedClass = Macroable(BaseClass);
            expect(typeof ProxiedClass.macro).toBe('function');
            expect(typeof ProxiedClass.getter).toBe('function');

            // Add macro
            ProxiedClass.macro('double', function() {
                return this.val * 2;
            });
            expect(ProxiedClass.hasMacroable('double')).toBe(true);
            expect(ProxiedClass.getMacroable('double')).toBeDefined();

            // Add getter non-singleton
            ProxiedClass.getter('triple', function() {
                return this.val * 3;
            });
            expect(ProxiedClass.hasGetter('triple')).toBe(true);
            expect(ProxiedClass.getGetter('triple')).toBeDefined();

            // Add getter singleton
            let count = 0;
            ProxiedClass.getter('cachedVal', function() {
                count++;
                return this.val + count;
            }, true);

            const instance = new ProxiedClass(5);
            expect(instance.double()).toBe(10);
            expect(instance.triple).toBe(15);

            expect(instance.cachedVal).toBe(6);
            expect(instance.cachedVal).toBe(6); // cached
            expect(count).toBe(1);

            // Hydrate cleans up macros and getters
            ProxiedClass.hydrate();
            expect(ProxiedClass.hasMacroable('double')).toBe(false);
            expect(ProxiedClass.hasGetter('triple')).toBe(false);
        });

        test('extend validates clazz argument', () => {
            expect(() => Macroable.extend('not-a-func')).toThrow('Extend param should be Class or Function');
            class MyService {}
            const Extended = Macroable.extend(MyService);
            expect(Extended).toBeDefined();
        });

        test('ProxyHandler construct, make, call, get, set, deleteProperty, ownKeys', () => {
            class Target {
                constructor() {
                    this.name = 'target';
                }
                greet(msg) {
                    return `Hello ${msg}`;
                }
            }

            const Proxied = Macroable(Target);
            const inst = new Proxied();

            // make & call
            const handler = Object.getPrototypeOf(Object.getPrototypeOf(inst));
            // get method
            expect(inst.greet('World')).toBe('Hello World');

            // set & get own property
            inst.age = 30;
            expect(inst.age).toBe(30);

            // delete property
            delete inst.age;
            expect(inst.age).toBeUndefined();

            // ownKeys
            expect(Object.keys(inst)).toContain('name');
        });

        test('ProxyHandler __get, __set, and __call dynamic traps', () => {
            class DynamicTarget {
                constructor() {
                    this.data = {};
                }
                __get(target, key, receiver) {
                    return `dynamic_${key}`;
                }
                __set(target, key, val) {
                    target.data[key] = val;
                    return true;
                }
                __call(instance, method, args) {
                    return `called_${method}_with_${args.join(',')}`;
                }
            }

            const DynamicClass = Macroable(DynamicTarget);
            const inst = new DynamicClass();

            // __get
            expect(inst.customProperty).toBe('dynamic_customProperty');

            // __set
            inst.dynamicProp = 'foo';
            expect(inst.data.dynamicProp).toBe('foo');

            // __call when no __get
            delete DynamicTarget.prototype.__get;
            expect(inst.someMethod('a', 'b')).toBe('called_someMethod_with_a,b');
        });

        test('implement copies interfaces to class', () => {
            class ContractA {
                methodA() {}
            }
            class TargetClass {}
            const Implemented = Macroable.implement(TargetClass, ContractA);
            expect(Implemented).toBeDefined();
        });

        test('ProxyHandler make, call, and apply methods', () => {
            const { ProxyHandler } = require('../src/macro');
            const targetObj = {
                greet(name) {
                    return `Hi ${name}`;
                },
                age: 25
            };

            expect(ProxyHandler.call(targetObj, 'greet', ['Alice'])).toBe('Hi Alice');
            expect(ProxyHandler.make(targetObj, 'age')).toBe(25);
            expect(ProxyHandler.make(targetObj, 'missing')).toBeUndefined();
            expect(ProxyHandler.make(targetObj, 'inspect')).toBeUndefined();
            expect(ProxyHandler.make(targetObj, Symbol('sym'))).toBeUndefined();

            const fn = function(self, args) { return args[0] * 2; };
            expect(ProxyHandler.apply(fn, null, [10])).toBe(20);

            // Macroable() when no argument passed uses this/empty
            const selfMacro = Macroable.call({});
            expect(selfMacro).toBeDefined();

            // key in target via prototype
            const protoObj = { protoMethod() { return 'proto'; } };
            const childObj = Object.create(protoObj);
            const proxiedChild = Macroable(childObj);
            expect(proxiedChild.protoMethod()).toBe('proto');

            // symbol property access
            const sym = Symbol('custom');
            childObj[sym] = 'symVal';
            expect(proxiedChild[sym]).toBe('symVal');

            // disallowed method on __call target
            class CallOnly {
                __call() {}
            }
            const proxiedCallOnly = Macroable(new CallOnly());
            expect(proxiedCallOnly.inspect).toBeUndefined();
            expect(proxiedCallOnly[Symbol('someSymbol')]).toBeUndefined();

            // target with __get handling disallowed method (inspect)
            class GetTarget {
                __get() {}
            }
            const proxiedGet = Macroable(new GetTarget());
            expect(proxiedGet.inspect).toBeUndefined();

            // target with __set returning false
            class FalseSetTarget {
                __set() { return false; }
            }
            const proxiedFalseSet = Macroable(new FalseSetTarget());
            proxiedFalseSet.anything = 'value';
            expect(proxiedFalseSet.anything).toBeUndefined();

            // call with default args = []
            expect(ProxyHandler.call({ noArgs() { return 'ok'; } }, 'noArgs')).toBe('ok');

            // target with no __set and not in target
            class PlainTarget {}
            const plainProxied = Macroable(new PlainTarget());
            plainProxied.newProp = 'newVal';
            expect(plainProxied.newProp).toBe('newVal');

            // function property preservation when accessed on proxy
            class TargetWithMethodProperties {
                get helper() {
                    const fn = function() { return 'helped'; };
                    fn.subProperty = 'sub';
                    return fn;
                }
            }
            const proxiedMethodProps = Macroable(new TargetWithMethodProperties());
            expect(typeof proxiedMethodProps.helper).toBe('function');
            expect(proxiedMethodProps.helper()).toBe('helped');
            expect(proxiedMethodProps.helper.subProperty).toBe('sub');
        });
    });
});
