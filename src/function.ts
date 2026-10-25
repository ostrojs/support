import nodePath from 'node:path';
import fs from 'fs-extra';
import util from 'node:util';
import crypto from 'node:crypto';

// Framework global registered by OstroJS at boot time
declare const app: (abstract?: any) => any;

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const path = nodePath;

export const callsites = (): any => {
	const _prepareStackTrace = Error.prepareStackTrace;
	Error.prepareStackTrace = (_, stack) => stack;
	const stack = (new Error().stack as string).slice(1);
	Error.prepareStackTrace = _prepareStackTrace;
	return stack;
};

export function is_numeric(num: any): boolean {
	return !isNaN(parseFloat(num)) && isFinite(num);
}

export function url(baseUrl: string, ...pieces: string[]): string {
	return new URL(nodePath.join(...pieces), baseUrl).href;
}

export function is_function(fn: any): fn is Function {
	return typeof fn === 'function';
}

export function array_merge<T = any>(array: T[], array2: T[]): T[] {
	return array.concat(array2);
}

export function unset(target: any, key: any): void {
	if (target && key !== undefined) {
		delete target[key];
	}
}

export function random(length: number): string {
	let result = '';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export const debounce = (func: Function, delay: number): { (...args: any[]): void; clear: () => void } => {
	let debounceTimer: any;
	let fn: any = function (this: any) {
		const context = this;
		const args = arguments;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => func.apply(context, args), delay);
	};
	fn.clear = function () {
		clearTimeout(debounceTimer);
	};
	return fn;
};

export function promiseAll(object: Record<string, any>): Promise<Record<string, any>> {
	let promisedProperties: Promise<any>[] = [];
	const objectKeys = Object.keys(object);
	objectKeys.forEach((key) => promisedProperties.push(object[key].catch((_err: any) => null)));
	return Promise.all(promisedProperties)
		.then((resolvedValues) => {
			return resolvedValues.reduce((resolvedObject: any, property: any, index: number) => {
				resolvedObject[objectKeys[index]] = property;
				return resolvedObject;
			}, object);
		});
}

export function include(dir: string): any {
	return require(dir);
}

export function call_user_func(fn: Function, ...args: any[]): any {
	return fn(...args);
}

export function use(dir: string): any {
	return require(dir);
}

export function exists(arg: any, value: any): any {
	return arg || value;
}

export function empty($value: any): boolean {
	if (!$value) {
		return true;
	} else if (typeof $value == 'object' && !Array.isArray($value)) {
		return Object.keys($value).length == 0;
	} else if (Array.isArray($value)) {
		return $value.length == 0;
	} else {
		return false;
	}
}

export function setPropertyToClassProto(proto: any, obj: Record<string, any>): void {
	for (let key in obj) {
		proto.prototype[key] = obj[key];
	}
}

export function count($value: any): number {
	if (Array.isArray($value)) {
		return $value.length;
	} else if ($value && typeof $value == 'object') {
		return Object.keys($value).length;
	} else {
		return 0;
	}
}

export function clone<T = any>(obj: T): T {
	if (obj == null || typeof obj !== 'object') {
		return obj;
	}
	let result: any = {};
	let keys_ = Object.getOwnPropertyNames(obj);
	for (let i = 0; i < keys_.length; i++) {
		let key = keys_[i];
		let value = (obj as Record<string, unknown>)[key];
		result[key] = value;
	}

	Object.setPrototypeOf(result, Object.getPrototypeOf(obj));
	return result;
}

export function IsClass(func: any): boolean {
	return typeof func === 'function' && /^class\s/.test(Function.prototype.toString.call(func));
}

export function str_replace(match: string | RegExp, replacer: any, text: string): string {
	return text.replace(match, replacer);
}

export function strlen(text: string = ''): number {
	return text.length;
}

export function strpos(text: string = '', search: string): boolean {
	return text.includes(search);
}

export function is_null(data: any): boolean {
	return data == null;
}

export function is_json(data: any): boolean {
	return typeof data == 'object' && !Array.isArray(data);
}

export function is_array(data: any): data is any[] {
	return Array.isArray(data);
}

export function method_exists(instance: any = {}, method: string): boolean {
	return method in instance && typeof instance[method] == 'function';
}

export function is_callable($cb: any): $cb is Function {
	return typeof $cb == 'function';
}

export function is_object($data: any): boolean {
	return typeof $data == 'object';
}

export function is_string($data: any): $data is string {
	return typeof $data == 'string';
}

export function isset(...args: any[]): boolean {
	let check = false;
	for (let i = 0; i < args.length; i++) {
		check = typeof args[i] != 'undefined';
		if (check == false) {
			return false;
		}
	}
	return check;
}

export function tap<T = any>(value: T, fn: (val: T) => any): T {
	fn(value);
	return value;
}

export function date(string: any): any {
	const DateTime = require('./dateTime').default || require('./dateTime');
	return new DateTime().format(string);
}

export function isFile($path: string): Promise<boolean> {
	return fs.lstat($path).then((stats: any) => stats.isFile()).catch((_err: any) => false);
}

export function is_file($path: string): Promise<boolean> {
	return isFile($path);
}

export function isDirectory($path: string): Promise<boolean> {
	return fs.lstat($path).then((stats: any) => stats.isDirectory()).catch((_err: any) => false);
}

export function is_directory($path: string): Promise<boolean> {
	return isDirectory($path);
}

export function isSymbolicLink($path: string): Promise<boolean> {
	return fs.lstat($path).then((stats: any) => stats.isSymbolicLink()).catch((_err: any) => false);
}

export function dirname($path: string): string {
	return nodePath.dirname($path);
}

export function isFunction(functionToCheck: any): boolean {
	return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export function env(key: string, defaultValue?: any): any {
	let value: any = process.env[key];
	if (!value && typeof defaultValue != 'undefined') {
		value = defaultValue;
	}

	if (value === 'true') value = true;
	else if (value === 'false') value = false;
	else if (value === 'null') value = null;
	return value;
}

export function config(arg?: any, defaultValue?: any): any {
	let conf = app('config');
	if (is_json(arg)) {
		for (let key in arg) {
			conf.set(key, arg[key]);
		}
	} else {
		return conf.get(arg, defaultValue);
	}
}

export function base_path(...args: string[]): string {
	const sanitized = args.map(arg => typeof arg === 'string' && arg.startsWith('~/') ? arg.slice(2) : arg);
	return nodePath.normalize(nodePath.join(process.cwd(), nodePath.join('/', ...sanitized)));
}

export function storage_path(...args: string[]): string {
	return base_path('storage', '/', ...args);
}

export function public_path(...args: string[]): string {
	return base_path('public', '/', ...args);
}

export function database_path(...args: string[]): string {
	return base_path('database', '/', ...args);
}

export function view_path(...args: string[]): string {
	return base_path('resources', 'views', '/', ...args);
}

export function app_path(...args: string[]): string {
	return base_path('app', ...args);
}

export function app_url(): any {
	return env('APP_URL');
}

export function collect(data?: any): any {
	const mod = require('./collection');
	const Collection = mod.default || mod;
	return Collection.collect(data);
}

export function mix(assetPath: string): any {
	return app('mix').path(assetPath);
}

export function get_class_name($class: any): string | undefined {
	let name = typeof $class == 'object' ? $class?.constructor?.name : (typeof $class == 'function' ? $class.name : undefined);
	return name ? name.replace(/^bound\s+/, '') : name;
}

export function get_class($class: any): any {
	return $class.constructor;
}

export function deepAssign(target: any, ...sources: any[]): any {
	sources.forEach(source => {
		let descriptors: Record<string | symbol, any> = Object.keys(source).reduce((desc: Record<string, any>, key: string) => {
			desc[key] = Object.getOwnPropertyDescriptor(source, key);
			return desc;
		}, {});
		Object.getOwnPropertySymbols(source).forEach(sym => {
			let descriptor = Object.getOwnPropertyDescriptor(source, sym);
			if (descriptor && descriptor.enumerable) {
				descriptors[sym] = descriptor;
			}
		});
		Object.defineProperties(target, descriptors);
	});
	return target;
}

export function mergePath(...args: string[]): string {
	return nodePath.resolve(args.reduce((newDir, dir) => {
		if (newDir != '') {
			return newDir + '/' + dir;
		} else {
			return newDir + dir;
		}
	}, ''));
}
export type AnyConstructor = new (...args: any[]) => any;

export type MergeConstructors<TBase, TMixins extends any[]> =
	(TMixins extends [infer M1, ...infer Rest]
		? (new (...args: any[]) => (TBase extends new (...args: any[]) => infer B ? B : {}) & (M1 extends new (...args: any[]) => infer M ? M : {})) & TBase & M1 & MergeConstructors<TBase, Rest>
		: TBase);

export function implement<TBase extends AnyConstructor, TMixin1 extends AnyConstructor>(
	base: TBase,
	mixin1: TMixin1
): (new (...args: any[]) => InstanceType<TBase> & InstanceType<TMixin1>) & TBase & TMixin1;

export function implement<TBase extends AnyConstructor, TMixin1 extends AnyConstructor, TMixin2 extends AnyConstructor>(
	base: TBase,
	mixin1: TMixin1,
	mixin2: TMixin2
): (new (...args: any[]) => InstanceType<TBase> & InstanceType<TMixin1> & InstanceType<TMixin2>) & TBase & TMixin1 & TMixin2;

export function implement<TBase extends AnyConstructor, TMixin1 extends AnyConstructor, TMixin2 extends AnyConstructor, TMixin3 extends AnyConstructor>(
	base: TBase,
	mixin1: TMixin1,
	mixin2: TMixin2,
	mixin3: TMixin3
): (new (...args: any[]) => InstanceType<TBase> & InstanceType<TMixin1> & InstanceType<TMixin2> & InstanceType<TMixin3>) & TBase & TMixin1 & TMixin2 & TMixin3;

export function implement<TBase extends AnyConstructor, TMixin1 extends AnyConstructor, TMixin2 extends AnyConstructor, TMixin3 extends AnyConstructor, TMixin4 extends AnyConstructor>(
	base: TBase,
	mixin1: TMixin1,
	mixin2: TMixin2,
	mixin3: TMixin3,
	mixin4: TMixin4
): (new (...args: any[]) => InstanceType<TBase> & InstanceType<TMixin1> & InstanceType<TMixin2> & InstanceType<TMixin3> & InstanceType<TMixin4>) & TBase & TMixin1 & TMixin2 & TMixin3 & TMixin4;

export function implement<TBase extends AnyConstructor, TMixin1 extends AnyConstructor, TMixin2 extends AnyConstructor, TMixin3 extends AnyConstructor, TMixin4 extends AnyConstructor, TMixin5 extends AnyConstructor>(
	base: TBase,
	mixin1: TMixin1,
	mixin2: TMixin2,
	mixin3: TMixin3,
	mixin4: TMixin4,
	mixin5: TMixin5
): (new (...args: any[]) => InstanceType<TBase> & InstanceType<TMixin1> & InstanceType<TMixin2> & InstanceType<TMixin3> & InstanceType<TMixin4> & InstanceType<TMixin5>) & TBase & TMixin1 & TMixin2 & TMixin3 & TMixin4 & TMixin5;

export function implement<TBase extends AnyConstructor, TMixin1 extends AnyConstructor, TMixin2 extends AnyConstructor, TMixin3 extends AnyConstructor, TMixin4 extends AnyConstructor, TMixin5 extends AnyConstructor, TMixin6 extends AnyConstructor>(
	base: TBase,
	mixin1: TMixin1,
	mixin2: TMixin2,
	mixin3: TMixin3,
	mixin4: TMixin4,
	mixin5: TMixin5,
	mixin6: TMixin6
): (new (...args: any[]) => InstanceType<TBase> & InstanceType<TMixin1> & InstanceType<TMixin2> & InstanceType<TMixin3> & InstanceType<TMixin4> & InstanceType<TMixin5> & InstanceType<TMixin6>) & TBase & TMixin1 & TMixin2 & TMixin3 & TMixin4 & TMixin5 & TMixin6;

export function implement<TBase extends AnyConstructor, TMixin1 extends AnyConstructor, TMixin2 extends AnyConstructor, TMixin3 extends AnyConstructor, TMixin4 extends AnyConstructor, TMixin5 extends AnyConstructor, TMixin6 extends AnyConstructor, TMixin7 extends AnyConstructor>(
	base: TBase,
	mixin1: TMixin1,
	mixin2: TMixin2,
	mixin3: TMixin3,
	mixin4: TMixin4,
	mixin5: TMixin5,
	mixin6: TMixin6,
	mixin7: TMixin7
): (new (...args: any[]) => InstanceType<TBase> & InstanceType<TMixin1> & InstanceType<TMixin2> & InstanceType<TMixin3> & InstanceType<TMixin4> & InstanceType<TMixin5> & InstanceType<TMixin6> & InstanceType<TMixin7>) & TBase & TMixin1 & TMixin2 & TMixin3 & TMixin4 & TMixin5 & TMixin6 & TMixin7;

export function implement(base: any, ...mixins: any[]): any;
export function implement(base: any, ...mixins: any[]): any {
	let aggregate = class __Aggregate extends base {
		/**
		 * Create a new instance.
		 * @param args - Constructor arguments.
		 */
		constructor(...args: any[]) {
			super(...args);
			mixins.forEach((mixin) => {
				if (typeof mixin.prototype.initializer === 'function') {
					mixin.prototype.initializer.apply(this, args);
				} else {
					Object.defineProperties(this, Object.getOwnPropertyDescriptors(new (mixin)(...args)));
				}
			});
		}
	};

	let copyProps = (target: any, source: any) => {
		const props: (string | symbol)[] = [...Object.getOwnPropertyNames(source), ...Object.getOwnPropertySymbols(source)];
		props.forEach((prop) => {
				if (typeof prop == 'string' && prop.match(/^(?:default|initializer|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
					return;
				} else {
					Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop)!);
				}
			});
	};

	mixins.forEach((mixin) => {
		copyProps(aggregate.prototype, mixin.prototype);
		copyProps(aggregate, mixin);
	});
	Object.defineProperty(aggregate, 'name', { value: base.name, configurable: true });
	return aggregate;
}

export function valueType(value: any): string {
	if (typeof value === 'string') {
		return 'string';
	} else if (value instanceof Array) {
		return 'array';
	} else if (typeof value == 'object' && !Array.isArray(value)) {
		return 'json';
	} else if (typeof Number(value) === 'number' && !isNaN(Number(value)) && typeof value !== 'boolean') {
		return 'number';
	} else {
		return typeof value;
	}
}

export function last<T = any>(arr: T[]): T | undefined {
	return arr.length ? arr[arr.length - 1] : undefined;
}

export function trim(str: string, chr?: string): string {
	let rgxtrim = (!chr) ? new RegExp('^\\s+|\\s+$', 'g') : new RegExp('^' + chr + '+|' + chr + '+$', 'g');
	return str.replace(rgxtrim, '');
}

export function rtrim(str: string, chr?: string): string {
	let rgxtrim = (!chr) ? new RegExp('\\s+$') : new RegExp(chr + '+$');
	return str.replace(rgxtrim, '');
}

export function ltrim(str: string, chr?: string): string {
	let rgxtrim = (!chr) ? new RegExp('^\\s+') : new RegExp('^' + chr + '+');
	return str.replace(rgxtrim, '');
}

export function class_basename($class: any): string {
	let className = typeof $class == 'object' && $class !== null ? $class.constructor.name : $class;
	return nodePath.basename(className);
}

export function sprintf(...args: any[]): string {
	return util.format(...args);
}

export function in_array(value: any, datas: any[] = []): boolean {
	return Array.isArray(datas) && datas.includes(value);
}

export function range(start: number, end: number, step: number = 1): number[] {
	return Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, index) => start + index * step);
}

export function str_contains(data: any, check: string): boolean {
	return typeof data == 'string' ? data.includes(check) : false;
}

export function getCallerFunctionName(name: string): string {
	const stack = new Error().stack?.split('\n') || [];

	let callerFunctionName = '';
	for (let i = 2; i < stack.length; i++) {
		const line = stack[i].trim();
		const matches = line.match(/at\s+Proxy\.(\w+)\s+\(/);
		if (matches && matches[1] == name) {
			const fnNames = stack[i + 1]?.trim().match(/at\s+Proxy\.(\w+)\s+\(/);
			if (fnNames && fnNames[1]) {
				callerFunctionName = fnNames[1];
			}
			break;
		}
	}

	return callerFunctionName;
}

export function hash_equals(knownString: unknown, userString: unknown): boolean {
	if (typeof knownString !== 'string' || typeof userString !== 'string') {
		return false;
	}
	const a = Buffer.from(knownString);
	const b = Buffer.from(userString);
	if (a.length !== b.length) {
		return false;
	}
	return crypto.timingSafeEqual(a, b);
}

export function value(val: any, ...args: any[]): any {
	return typeof val === 'function' ? val(...args) : val;
}

export function md5(str: any): string {
	return crypto.createHash('md5').update(String(str)).digest('hex');
}

export function sha1(str: any): string {
	return crypto.createHash('sha1').update(String(str)).digest('hex');
}
