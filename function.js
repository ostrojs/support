const nodePath = require('path');
const fs = require('fs-extra')
const util = require('util')
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
Date.format = function (format) {
	return require('./facades/date').format(format)
}

exports.callsites = () => {
	const _prepareStackTrace = Error.prepareStackTrace;
	Error.prepareStackTrace = (_, stack) => stack;
	const stack = new Error().stack.slice(1);
	Error.prepareStackTrace = _prepareStackTrace;
	return stack;
};

exports.path = nodePath

module.__proto__.require = function ($path) {
	var self = this;
	if ($path.startsWith('~/')) {
		$path = nodePath.resolve($path.replaceFirst('~/', ''))
	}
	return self.constructor._load($path, self);

}

exports.is_numeric = function (num) {
	return !isNaN(parseFloat(num)) && isFinite(num);
}

exports.url = function url(baseUrl, ...pieces) {
	return new URL(path.join(...pieces), baseUrl).href
}

exports.is_function = function (fn) {
	return typeof fn == 'function'
}

exports.array_merge = function (array, array2) {
	return array.concat(array2)
}

exports.unset = function (obj) {
	delete obj
}

exports.random = function (length) {
	let result = '';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
}

exports.debounce = (func, delay) => {
	let debounceTimer
	let fn = function () {
		const context = this
		const args = arguments
		clearTimeout(debounceTimer)
		debounceTimer
			= setTimeout(() => func.apply(context, args), delay)
	}
	fn.clear = function () {
		clearTimeout(debounceTimer)
	}
	return fn
}

exports.promiseAll = function promiseAll(object) {
	let promisedProperties = [];
	const objectKeys = Object.keys(object);
	objectKeys.forEach((key) => promisedProperties.push(object[key].catch(err => null)));
	return Promise.all(promisedProperties)
		.then((resolvedValues) => {
			return resolvedValues.reduce((resolvedObject, property, index) => {
				resolvedObject[objectKeys[index]] = property;
				return resolvedObject;
			}, object);
		})
}

exports.include = function include(dir) {
	return require(dir)
}

exports.call_user_func = function (fn, ...args) {
	return fn(...args)
}

exports.use = function include(dir) {
	return require(dir)
}

exports.exists = function (arg, value) {
	return arg || value
}

exports.empty = function ($value) {
	if (!$value)
		return true
	else if (typeof $value == 'object' && !Array.isArray($value))
		return Object.keys($value).length == 0
	else if (Array.isArray($value))
		return $value.length == 0
	else
		return false
}

exports.setPropertyToClassProto = function (proto, obj) {
	for (let key in obj) {
		proto.prototype[key] = obj[key]
	}
}

exports.count = function ($value) {
	if (Array.isArray($value))
		return $value.length
	else if (typeof $value == 'object')
		return Object.keys($value).length
	else
		return 0
}

exports.clone = function (obj) {
	if (obj == null || typeof obj !== "object") { return obj; }
	var result = {};
	var keys_ = Object.getOwnPropertyNames(obj);
	for (var i = 0; i < keys_.length; i++) {
		var key = keys_[i],
			value = obj[key];
		result[key] = value;
	}

	Object.setPrototypeOf(result, obj.__proto__);
	return result;
}

exports.IsClass = function (func) {
	return typeof func === 'function' && /^class\s/.test(Function.prototype.toString.call(func));
}

exports.str_replace = function str_replace(match, replacer, text) {
	return text.replace(match, replacer)
}

exports.strlen = function strlen(text = '') {
	return text.length
}

exports.strpos = function (text = '', search) {
	return text.includes(search)
}

exports.call_user_func = function (fn, arguments) {
	return fn(...arguments)
}

exports.is_null = function (data) {
	return data == null
}

exports.is_json = function (data) {
	return typeof data == 'object' && !Array.isArray(data)
}

exports.is_array = function (data) {
	return Array.isArray(data)
}

exports.method_exists = function (instance = {}, method) {
	return typeof instance[method] == 'function'
}

exports.is_callable = function ($cb) {
	return typeof $cb == 'function'
}

exports.is_object = function ($data) {
	return typeof $data == 'object'
}

exports.is_string = function ($data) {
	return typeof $data == 'string'
}

exports.isset = function (...arguments) {
	let check = false
	for (var i = 0; i < arguments.length; i++) {
		check = typeof arguments[i] != 'undefined'
		if (check == false) {
			return false
		}
	}
	return check
}

exports.tap = function (value, fn) {
	fn(value)
	return value
}

exports.date = function (string) {
	return Date.format(string)
}

exports.isFile = function ($path) {
	return fs.lstat($path).then(stats => stats.isFile()).catch(err => false);
}

exports.is_file = function ($path) {
	return this.isFile($path)
}

exports.isDirectory = function ($path) {
	return fs.lstat($path).then(stats => stats.isDirectory()).catch(err => false);
}

exports.is_directory = function ($path) {
	return this.isDirectory($path)
}

exports.isSymbolicLink = function ($path) {
	return fs.lstat($path).then(stats => stats.isSymbolicLink()).catch(err => false);
}

exports.dirname = function ($path) {
	return path.dirname($path)
}

exports.isFunction = function (functionToCheck) {
	return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

exports.env = function (key, defaultValue) {
	let value = process.env[key]
	if (!value && typeof defaultValue != 'undefined') {
		value = defaultValue
	}

	if (value === 'true') value = true;
	else if (value === 'false') value = false;
	else if (value === 'null') value = null;
	return value
}

exports.config = function (arg, defaultValue) {
	let conf = app('config')
	if (is_json(arg)) {
		for (let key in arg) {
			conf.set(key, arg[key])
		}
	} else {
		return conf.get(arg, defaultValue)
	}
}

exports.storage_path = function () {
	return base_path('storage', '/', ...arguments)
}

exports.public_path = function () {
	return base_path('public', '/', ...arguments)
}

exports.database_path = function () {
	return base_path('database', '/', ...arguments)
}

exports.view_path = function () {
	return base_path('resources', 'views', '/', ...arguments)
}

exports.app_path = function () {
	return base_path('app', ...arguments)
}

exports.app_url = function () {
	return env('APP_URL')
}

exports.collect = function (data) {
	return require('./collection').collect(data)
}

exports.mix = function (assetPath) {
	return app('mix').path(assetPath)
}

exports.get_class_name = function ($class) {
	return typeof $class == 'object' ? $class.constructor.name : (typeof $class == 'function' ? $class.name : undefined)
}

exports.get_class = function ($class) {
	return $class.constructor;
}

exports.deepAssign = function (target, ...sources) {
	sources.forEach(source => {
		let descriptors = Object.keys(source).reduce((descriptors, key) => {
			descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
			return descriptors;
		}, {});
		Object.getOwnPropertySymbols(source).forEach(sym => {
			let descriptor = Object.getOwnPropertyDescriptor(source, sym);
			if (descriptor.enumerable) {
				descriptors[sym] = descriptor;
			}
		});
		Object.defineProperties(target, descriptors);
	});
	return target;
}

exports.mergePath = function () {
	return nodePath.resolve(Array.from(arguments).reduce((newDir, dir) => {
		if (newDir != '')
			return newDir + '/' + dir
		else
			return newDir + dir
	}, ''))
}

exports.base_path = function () {
	return nodePath.normalize(nodePath.join(process.cwd(), nodePath.join('/', ...arguments)))
}

exports.implement = function (base, ...mixins) {
	let aggregate = class __Aggregate extends base {
		constructor(...args) {
			super(...args)
			mixins.forEach((mixin) => {
				if (typeof mixin.prototype.initializer === "function") {
					mixin.prototype.initializer.apply(this, args)
				} else {
					Object.defineProperties(this, Object.getOwnPropertyDescriptors(new (mixin)(...args)))
				}
			})

		}
	};

	let copyProps = (target, source) => {
		Object.getOwnPropertyNames(source)
			.concat(Object.getOwnPropertySymbols(source))
			.forEach((prop) => {
				if (typeof prop == 'string' && prop.match(/^(?:initializer|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
					return

				else {
					Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop))
				}
			})
	}

	mixins.forEach((mixin) => {
		copyProps(aggregate.prototype, mixin.prototype)
		copyProps(aggregate, mixin)
	})
	aggregate.name = base.name
	return aggregate
}

exports.valueType = function (value) {
	if (typeof value === 'string') {
		return 'string';
	} else if (value instanceof Array) {
		return 'array'
	} else if (typeof value == 'object' && !Array.isArray(value)) {
		return 'json'
	} else if (typeof Number(value) === 'number' && !isNaN(Number(value)) && typeof value !== 'boolean') {
		return 'number'
	} else {
		return typeof value
	}

}

exports.last = function (arr) {
	return arr.length ? arr[arr.length - 1] : undefined
}

exports.trim = function (str, chr) {
	var rgxtrim = (!chr) ? new RegExp('^\\s+|\\s+$', 'g') : new RegExp('^' + chr + '+|' + chr + '+$', 'g');
	return str.replace(rgxtrim, '');
}

exports.rtrim = function (str, chr) {
	var rgxtrim = (!chr) ? new RegExp('\\s+$') : new RegExp(chr + '+$');
	return str.replace(rgxtrim, '');
}

exports.ltrim = function (str, chr) {
	var rgxtrim = (!chr) ? new RegExp('^\\s+') : new RegExp('^' + chr + '+');
	return str.replace(rgxtrim, '');
}

exports.class_basename = function ($class) {
	$class = typeof $class == 'object' ? $class.constructor.name : $class;

	return path.basename($class);
}

exports.sprintf = function () {
	return util.format(...arguments);
}

exports.in_array = function (value, datas = []) {
	return Array.isArray(datas) && datas.includes(value)
}

exports.range = function (start, end, step = 1) {
	return Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, index) => start + index * step);
}

exports.getCallerFunctionName = function (name) {
	const stack = new Error().stack.split('\n');

	let callerFunctionName = '';
	for (let i = 2; i < stack.length; i++) {
		const line = stack[i].trim();
		const matches = line.match(/at\s+Proxy\.(\w+)\s+\(/);
		if (matches && matches[1] == name) {
			const fnNames = stack[i + 1].trim().match(/at\s+Proxy\.(\w+)\s+\(/);
			callerFunctionName = fnNames[1];
			break;
		}


	}

	return callerFunctionName;
}
