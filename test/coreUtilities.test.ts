import bond from '../src/bond';
import { compose, errors } from '../src/compose';
import ConfigurationUrlParser from '../src/configurationUrlParser';
import { plural, singular } from '../src/pluralize';
import * as Str from '../src/string';
import { base_path } from '../src/function';

describe('bond', () => {
    class Base {
        prop?: string;
        baseMethod() {
            return this.prop;
        }
    }
    class Child extends Base {
        constructor() {
            super();
            this.prop = 'val';
        }
        childMethod() {
            return this.prop;
        }
        otherMethod() {
            return 'other';
        }
    }

    test('binds methods with default options', () => {
        const instance = new Child();
        bond(instance);
        const { childMethod, baseMethod } = instance;
        expect(childMethod()).toBe('val');
        expect(baseMethod()).toBe('val');
    });

    test('binds with include filter (string and regex) and attaches bond properties', () => {
        const instance = new Child();
        bond(instance, { extra: 123 }, { include: ['childMethod', /other/] });
        const { childMethod, otherMethod } = instance;
        expect(childMethod()).toBe('val');
        expect(otherMethod()).toBe('other');
        expect((instance as any).extra).toBe(123);
    });

    test('binds with exclude filter (string and regex)', () => {
        const instance = new Child();
        bond(instance, null, { exclude: ['otherMethod', /base/] });
        const { childMethod } = instance;
        expect(childMethod()).toBe('val');
    });
});

describe('compose and errors', () => {
    test('throws TypeError if handler is not a function', () => {
        expect(() => {
            compose('not a function');
        }).toThrow(TypeError);
    });

    test('compose standard middleware chain (req, res, next)', (done) => {
        const middleware = compose(
            (req: any, res: any, next: any) => {
                req.step1 = true;
                next();
            },
            [
                (req: any, res: any, next: any) => {
                    req.step2 = true;
                    next();
                }
            ]
        );

        const req: any = {};
        const res: any = {};
        middleware(req, res, (err: any) => {
            expect(err).toBeUndefined();
            expect(req.step1).toBe(true);
            expect(req.step2).toBe(true);
            done();
        });
    });

    test('compose error handling middleware and next(err)', (done) => {
        const testErr = new Error('middleware failure');
        const middleware = compose(
            (req: any, res: any, next: any) => {
                next(testErr);
            },
            (req: any, res: any, next: any) => {
                // should be skipped because of err
                req.skipped = true;
                next();
            },
            (err: any, req: any, res: any, next: any) => {
                expect(err).toBe(testErr);
                req.errorCaught = true;
                next();
            }
        );

        const req: any = {};
        middleware(req, {}, (err: any) => {
            expect(req.errorCaught).toBe(true);
            expect(req.skipped).toBeUndefined();
            done();
        });
    });

    test('throws error if next() called multiple times', (done) => {
        const middleware = compose(
            (req: any, res: any, next: any) => {
                next();
                try {
                    next();
                } catch (e: any) {
                    expect(e).toBeInstanceOf(TypeError);
                    expect(e.message).toContain('`next()` called multiple times');
                    done();
                }
            },
            (req: any, res: any, next: any) => {
                next();
            }
        );
        middleware({}, {}, () => {});
    });

    test('errors middleware generator', (done) => {
        const middleware = errors(
            (err: any, req: any, res: any, next: any) => {
                req.handled = true;
                next(err);
            }
        );
        const req: any = {};
        middleware(new Error('boom'), req, {}, (err: any) => {
            expect(req.handled).toBe(true);
            expect(err.message).toBe('boom');
            done();
        });
    });

    test('catches thrown synchronous error in handler', (done) => {
        const middleware = compose(
            (req: any, res: any, next: any) => {
                throw new Error('sync thrown');
            },
            (err: any, req: any, res: any, next: any) => {
                expect(err.message).toBe('sync thrown');
                next();
            }
        );
        middleware({}, {}, () => {
            done();
        });
    });

    test('rethrows synchronous error if next() was already called', () => {
        const middleware = compose(
            (req: any, res: any, next: any) => {
                next();
                throw new Error('after next sync error');
            },
            (req: any, res: any, next: any) => {
                next();
            }
        );
        expect(() => {
            middleware({}, {}, () => {});
        }).toThrow('after next sync error');
    });
});

describe('ConfigurationUrlParser', () => {
    const parser = new ConfigurationUrlParser();

    test('returns config as is if no url', () => {
        const cfg = { host: 'localhost' };
        expect(parser.parseConfiguration(cfg)).toBe(cfg);
    });

    test('parses mysql URL and aliases', () => {
        const parsed = parser.parseConfiguration('mysql2://user:pass@127.0.0.1:3306/mydb?charset=utf8mb4&ssl=true');
        expect(parsed.driver).toBe('mysql');
        expect(parsed.username).toBe('user');
        expect(parsed.password).toBe('pass');
        expect(parsed.host).toBe('127.0.0.1');
        expect(parsed.port).toBe('3306');
        expect(parsed.database).toBe('mydb');
        expect(parsed.charset).toBe('utf8mb4');
        expect(parsed.ssl).toBe(true);
    });

    test('parses sqlite URL', () => {
        const parsed = parser.parseConfiguration({ url: 'sqlite3:///path/to/db.sqlite' });
        expect(parsed.driver).toBe('sqlite');
        expect(parsed.database).toBe('/path/to/db.sqlite');
    });

    test('parses url with no path or empty path', () => {
        const parsed = parser.parseConfiguration('custom://localhost:5432/');
        expect(parsed.driver).toBe('custom');
        expect(parsed.database).toBeNull();
    });

    test('parses url with no query string and no protocol', () => {
        const urlObj = { protocol: '', host: 'localhost' };
        expect(parser.getDriver(urlObj)).toBeNull();
        expect(parser.getQueryOptions({ query: '' })).toEqual({});
    });

    test('driver aliases methods', () => {
        expect(parser.get$DriverAliases()).toBeDefined();
        parser.addDriverAlias('myalias', 'mydriver');
        expect(parser.get$DriverAliases()['myalias']).toBe('mydriver');
    });

    test('parseStringsToNativeTypes with arrays and non-strings', () => {
        expect(parser.parseStringsToNativeTypes(['123', 'true', 'plain'])).toEqual([123, true, 'plain']);
        expect(parser.parseStringsToNativeTypes(1234)).toBe(1234);
    });
});

describe('pluralize', () => {
    test('plural and singular with numbers and flags', () => {
        expect(plural('user')).toBe('users');
        expect(plural('user', 1)).toBe('user');
        expect(plural('user', 2)).toBe('users');
        expect(plural('user', 2, true)).toBe('2 users');
        expect(singular('users')).toBe('user');
        expect(singular('')).toBe('');
        expect(plural('')).toBe('');
    });

    test('uncountables and irregulars', () => {
        expect(plural('fish')).toBe('fish');
        expect(singular('fish')).toBe('fish');
        expect(plural('ox')).toBe('oxen');
        expect(singular('oxen')).toBe('ox');
        expect(plural('foot')).toBe('feet');
        expect(singular('feet')).toBe('foot');
        expect(plural('quiz')).toBe('quizzes');
        expect(singular('quizzes')).toBe('quiz');
        expect(plural('thief')).toBe('thieves');
        expect(singular('thieves')).toBe('thief');
    });

    test('case preservation', () => {
        expect(plural('User')).toBe('Users');
        expect(plural('USER')).toBe('USERS');
        expect(singular('Users')).toBe('User');
        expect(singular('USERS')).toBe('USER');
    });
});

describe('Str (string.js)', () => {
    test('all string helper functions', () => {
        expect(Str.plural('post')).toBe('posts');
        expect(Str.singular('posts')).toBe('post');
        expect(Str.lower('HELLO')).toBe('hello');
        expect(Str.uper('hello')).toBe('HELLO');
        expect(Str.ucfirst('hello world')).toBe('Hello world');
        expect(Str.ucfirst('')).toBe('');
        expect(Str.capitalize('hello world')).toBe('Hello world');
        expect(Str.isString('test')).toBe(true);
        expect(Str.isString(123)).toBe(false);
        expect(Str.pascal('hello_world')).toBe('HelloWorld');
        expect(Str.camelCase('hello_world')).toBe('helloWorld');
        expect(Str.camel('hello_world')).toBe('helloWorld');
        expect(Str.studly('hello_world')).toBe('HelloWorld');
        expect(Str.deburr('déjà vu')).toBe('deja vu');
        expect(Str.endsWith('hello world', 'world')).toBe(true);
        expect(Str.escape('<tag>')).toBe('&lt;tag&gt;');
        expect(Str.escapeRegExp('[test]')).toBe('\\[test\\]');
        expect(Str.kebabCase('helloWorld')).toBe('hello-world');
        expect(Str.lowerFirst('HelloWorld')).toBe('helloWorld');
        expect(Str.pad('hi', 6)).toBe('  hi  ');
        expect(Str.padEnd('hi', 4)).toBe('hi  ');
        expect(Str.padStart('hi', 4)).toBe('  hi');
        expect(Str.repeat('a', 3)).toBe('aaa');
        expect(Str.startCase('hello_world')).toBe('Hello World');
        expect(Str.snakeCase('helloWorld')).toBe('hello_world');
        expect(Str.snake('helloWorld')).toBe('hello_world');
        expect(Str.startsWith('hello world', 'hello')).toBe(true);
        expect(Str.truncate('hello world', { length: 8 })).toBe('hello...');
        expect(Str.upperFirst('hello')).toBe('Hello');
        expect(Str.words('hello world')).toEqual(['hello', 'world']);
        expect(Str.replace('hello world', 'world', 'there')).toBe('hello there');

        // replaceFirst
        expect(Str.replaceFirst('a-b-c', '-b-', 'x')).toBe('axc');
        expect(Str.replaceFirst('hello hello', /hello/, 'hi')).toBe('hi hello');

        // replaceAll
        expect(Str.replaceAll('foo bar foo', 'foo', 'baz')).toBe('baz bar baz');
        expect(Str.replaceAll('a\\b a\\b', ['a\\', 'b'], 'x')).toBe('xx xx');

        // replaceArray & replaceAllArray
        expect(Str.replaceArray('a b c', ['a', 'b'], ['1', '2'])).toBe('1 2 c');
        expect(Str.replaceAllArray('a a b', ['a', 'b'], ['1', '2'])).toBe('1 1 2');

        // trim, trimEnd, finish, after, includes, contains, pluralStudly
        expect(Str.trim('  hello  ')).toBe('hello');
        expect(Str.trimEnd('  hello  ')).toBe('  hello');
        expect(Str.finish('path/to', '/')).toBe('path/to/');
        expect(Str.finish('path/to/', '/')).toBe('path/to/');
        expect(Str.after('this is an awesome string', 'is an ')).toBe('awesome string');
        expect(Str.includes('hello world', 'world')).toBe(true);
        expect(Str.contains('hello world', 'world')).toBe(true);
        expect(Str.pluralStudly('user_account')).toBe('userAccounts');
    });

    test('base_path supports standard relative paths and ~/ alias', () => {
        const path = require('path');
        const standard = base_path('app/models/user');
        const tilde = base_path('~/app/models/user');
        expect(standard).toBe(path.resolve(process.cwd(), 'app/models/user'));
        expect(tilde).toBe(standard);
    });

    test('helpers ~/ module resolution resolves package.json, build path fallback, and global.$basePath', () => {
        const path = require('path');
        const fs = require('fs');
        const Module = require('module');
        require('../src/helpers');
        
        // Resolve direct file
        const resolved = Module._resolveFilename('~/package.json', module, false);
        expect(resolved).toBe(path.resolve(process.cwd(), 'package.json'));

        // Test build path branch
        const buildDir = path.resolve(process.cwd(), 'build');
        const testFile = path.resolve(buildDir, 'temp-resolve-test.js');
        if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });
        fs.writeFileSync(testFile, 'module.exports = { ok: true };');
        try {
            const resolvedBuild = Module._resolveFilename('~/temp-resolve-test', module, false);
            expect(resolvedBuild).toBe(testFile);
        } finally {
            if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
        }

        // Test custom user outDir via OSTRO_BUILD_DIR
        const customDir = path.resolve(process.cwd(), '.dist');
        const customTestFile = path.resolve(customDir, 'custom-resolve-test.js');
        if (!fs.existsSync(customDir)) fs.mkdirSync(customDir, { recursive: true });
        fs.writeFileSync(customTestFile, 'module.exports = { ok: true };');
        process.env.OSTRO_BUILD_DIR = '.dist';
        try {
            const resolvedCustom = Module._resolveFilename('~/custom-resolve-test', module, false);
            expect(resolvedCustom).toBe(customTestFile);
        } finally {
            delete process.env.OSTRO_BUILD_DIR;
            if (fs.existsSync(customTestFile)) fs.unlinkSync(customTestFile);
            if (fs.existsSync(customDir)) fs.rmSync(customDir, { recursive: true, force: true });
        }

        // Test with global.$basePath set
        (global as any).$basePath = path.resolve(process.cwd());
        const resolvedWithGlobal = Module._resolveFilename('~/package.json', module, false);
        expect(resolvedWithGlobal).toBe(path.resolve(process.cwd(), 'package.json'));
        delete (global as any).$basePath;

        // Test non-existent path throws
        expect(() => Module._resolveFilename('~/non-existent-xyz', module, false)).toThrow(/non-existent-xyz/);
    });
});
