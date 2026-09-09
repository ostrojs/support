const lodash = require('lodash');
const { plural, singular } = require('./pluralize');

exports.plural = (...arg) => plural(...arg);
exports.singular = (...arg) => singular(...arg);

exports.lower = function lower(string = '') {
    return String(string).toLowerCase();
}

exports.uper = function uper(string = '') {
    return String(string).toUpperCase();
}

exports.ucfirst = function ucfirst(string = '') {
    const str = String(string);
    return str ? str[0].toUpperCase() + str.slice(1) : '';
}

exports.capitalize = function capitalize(string = '') {
    return lodash.capitalize(string);
}

exports.isString = function isString(content) {
    return typeof content === 'string';
}

exports.pascal = function pascal(string = '') {
    return lodash.upperFirst(lodash.camelCase(string));
}

exports.camelCase = (...arg) => lodash.camelCase(...arg);

exports.camel = exports.camelCase;

exports.studly = exports.pascal;

exports.deburr = (...arg) => lodash.deburr(...arg);

exports.endsWith = (...arg) => lodash.endsWith(...arg);

exports.escape = (...arg) => lodash.escape(...arg);

exports.escapeRegExp = (...arg) => lodash.escapeRegExp(...arg);

exports.kebabCase = (...arg) => lodash.kebabCase(...arg);

exports.lowerFirst = (...arg) => lodash.lowerFirst(...arg);

exports.pad = (...arg) => lodash.pad(...arg);

exports.padEnd = (...arg) => lodash.padEnd(...arg);

exports.padStart = (...arg) => lodash.padStart(...arg);

exports.repeat = (...arg) => lodash.repeat(...arg);

exports.startCase = (...arg) => lodash.startCase(...arg);

exports.snakeCase = (...arg) => lodash.snakeCase(...arg);

exports.snake = exports.snakeCase;

exports.startsWith = (...arg) => lodash.startsWith(...arg);

exports.truncate = (...arg) => lodash.truncate(...arg);

exports.upperFirst = (...arg) => lodash.upperFirst(...arg);

exports.words = (...arg) => lodash.words(...arg);

exports.replace = (...arg) => lodash.replace(...arg);

exports.replaceFirst = function replaceFirst(string = '', pattern = '', replacement) {
    var pStr = typeof pattern === 'string' ? pattern.replace(/\\/ig, '\\\\') : pattern;
    return exports.replace(string, new RegExp(pStr, "g"), replacement);
}

exports.replaceAll = function replaceAll(string = '', pattern = '', replacement) {
    var str = String(string);
    if (Array.isArray(pattern)) {
        for (var i = 0; i < pattern.length; i++) {
            var itemStr = typeof pattern[i] === 'string' ? pattern[i].replace(/\\/ig, '\\\\') : pattern[i];
            str = exports.replace(str, new RegExp(itemStr, "ig"), replacement);
        }
    } else {
        var pStr = typeof pattern === 'string' ? pattern.replace(/\\/ig, '\\\\') : pattern;
        str = exports.replace(str, new RegExp(pStr, "ig"), replacement);
    }
    return str;
}

exports.replaceArray = function replaceArray(string = '', find = [], replaceWith = []) {
    var str = String(string);
    for (var i = 0; i < find.length; i++) {
        str = str.replace(find[i], replaceWith[i]);
    }
    return str;
}

exports.replaceAllArray = function replaceAllArray(string = '', find = [], replaceWith = []) {
    var str = String(string);
    for (var i = 0; i < find.length; i++) {
        str = str.replaceAll(find[i], replaceWith[i]);
    }
    return str;
}

exports.trim = (...arg) => lodash.trim(...arg);

exports.trimEnd = (...arg) => lodash.trimEnd(...arg);

exports.finish = function finish(string = '', finished = '') {
    var str = String(string);
    if (!str.endsWith(finished)) {
        str = str + finished;
    }
    return str;
}

exports.after = function after(string = '', afterStr = '') {
    return String(string).replace(new RegExp('(.*)' + afterStr), "");
}

exports.includes = function includes(string = '', wordsToInclude) {
    return String(string).includes(wordsToInclude);
}

exports.contains = function contains(...args) {
    return exports.includes(...args);
}

exports.pluralStudly = function pluralStudly(string = '') {
    const studlyCaseString = exports.camelCase(string);
    return exports.plural(studlyCaseString);
}
