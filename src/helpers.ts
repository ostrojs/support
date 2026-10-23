import * as functions from './function';
import * as arrays from './array';
import * as strings from './string';
import './object';
import * as path from 'path';
import * as fs from 'fs';

let loaded = false;

(function globals() {
    if (!loaded) {
        loaded = true;
        Object.keys(functions).forEach(helperKey => {
            (global as any)[helperKey] = (functions as any)[helperKey];
        });
        Object.keys(arrays).forEach(arraykey => {
            Object.defineProperty(Array.prototype, arraykey, {
                value: (arrays as any)[arraykey],
                enumerable: false,
                writable: true,
                configurable: true
            });
        });
        const nativeStringProtoProps = new Set(Object.getOwnPropertyNames(String.prototype));
        Object.keys(strings).forEach(strKey => {
            const strFn = (strings as any)[strKey];
            (String as any)[strKey] = strFn;
            if (!nativeStringProtoProps.has(strKey)) {
                Object.defineProperty(String.prototype, strKey, {
                    value: function (this: any, ...args: any[]) {
                        return strFn(this, ...args);
                    },
                    enumerable: false,
                    writable: true,
                    configurable: true
                });
            }
        });

        const Module = require('module');
        if (Module && Module._resolveFilename && !(Module as any)._ostroPathHookInstalled) {
            (Module as any)._ostroPathHookInstalled = true;
            const originalResolveFilename = Module._resolveFilename;
            Module._resolveFilename = function (request: string, parent: any, isMain: boolean, options: any) {
                if (typeof request === 'string' && request.startsWith('~/')) {
                    const relativePath = request.slice(2);
                    const cwd = (global as any).$basePath || process.cwd();
                    const directPath = path.resolve(cwd, relativePath);
                    const srcPath = path.resolve(cwd, 'src', relativePath);
                    let userOutDir = process.env.OSTRO_BUILD_DIR || '';
                    if (!userOutDir) {
                        for (const tsConfigFile of ['tsconfig.build.json', 'tsconfig.json']) {
                            const fullTsPath = path.join(cwd, tsConfigFile);
                            if (fs.existsSync(fullTsPath)) {
                                try {
                                    const rawConfig = fs.readFileSync(fullTsPath, 'utf8');
                                    const parsed = JSON.parse(rawConfig);
                                    if (parsed && typeof parsed === 'object' && parsed.compilerOptions && typeof parsed.compilerOptions.outDir === 'string') {
                                        userOutDir = parsed.compilerOptions.outDir.replace(/^\.[/\\]/, '');
                                        break;
                                    }
                                } catch (_) {
                                    // Malformed or unreadable tsconfig gracefully ignored
                                }
                            }
                        }
                    }
                    userOutDir = userOutDir || '.dist';
                    const customOutPath = path.resolve(cwd, userOutDir, relativePath);
                    const buildPath = path.resolve(cwd, 'build', relativePath);
                    const hasTs = Boolean(require.extensions && require.extensions['.ts']);
                    if (hasTs && (fs.existsSync(srcPath + '.ts') || fs.existsSync(path.join(srcPath, 'index.ts')))) {
                        request = srcPath;
                    } else if (hasTs && (fs.existsSync(directPath + '.ts') || fs.existsSync(path.join(directPath, 'index.ts')))) {
                        request = directPath;
                    } else if (fs.existsSync(directPath + '.js') || fs.existsSync(path.join(directPath, 'index.js')) || (fs.existsSync(directPath) && !fs.statSync(directPath).isDirectory())) {
                        request = directPath;
                    } else if (fs.existsSync(customOutPath + '.js') || fs.existsSync(path.join(customOutPath, 'index.js')) || (fs.existsSync(customOutPath) && !fs.statSync(customOutPath).isDirectory())) {
                        request = customOutPath;
                    } else if (fs.existsSync(buildPath + '.js') || fs.existsSync(path.join(buildPath, 'index.js')) || (fs.existsSync(buildPath) && !fs.statSync(buildPath).isDirectory())) {
                        request = buildPath;
                    } else if (fs.existsSync(srcPath + '.js') || fs.existsSync(path.join(srcPath, 'index.js')) || (fs.existsSync(srcPath) && !fs.statSync(srcPath).isDirectory())) {
                        request = srcPath;
                    } else {
                        request = directPath;
                    }
                }
                return originalResolveFilename.call(this, request, parent, isMain, options);
            };

            const originalLoad = Module._load;
            Module._load = function (request: string, parent: any, isMain: boolean) {
                const exports = originalLoad.call(this, request, parent, isMain);
                if (typeof request === 'string' && !request.startsWith('.') && !request.startsWith('/') && !request.startsWith('~') && !request.startsWith('@ostro/')) {
                    return exports;
                }
                if (parent?.filename && parent.filename.includes('node_modules') && !parent.filename.includes('node_modules/@ostro')) {
                    return exports;
                }
                if (exports && exports.__esModule && exports.default) {
                    const def = exports.default;
                    if (typeof def === 'function' || (typeof def === 'object' && def !== null)) {
                        for (const key of Object.keys(exports)) {
                            if (key !== 'default' && key !== '__esModule' && !(key in def)) {
                                try {
                                    def[key] = exports[key];
                                } catch (_) {}
                            }
                        }
                    }
                    return def;
                }
                return exports;
            };
        }
    }
})();

export {};
