const lodash = require('lodash');
var plural = {
    '(quiz)$': "$1zes",
    '^(ox)$': "$1en",
    '([m|l])ouse$': "$1ice",
    '(matr|vert|ind)ix|ex$': "$1ices",
    '(x|ch|ss|sh)$': "$1es",
    '([^aeiouy]|qu)y$': "$1ies",
    '(hive)$': "$1s",
    '(?:([^f])fe|([lr])f)$': "$1$2ves",
    '(shea|lea|loa|thie)f$': "$1ves",
    'sis$': "ses",
    '([ti])um$': "$1a",
    '(tomat|potat|ech|her|vet)o$': "$1oes",
    '(bu)s$': "$1ses",
    '(alias)$': "$1es",
    '(octop)us$': "$1i",
    '(ax|test)is$': "$1es",
    '(us)$': "$1es",
    '([^s]+)$': "$1s"
};
var singular = {
    '(quiz)zes$': "$1",
    '(matr)ices$': "$1ix",
    '(vert|ind)ices$': "$1ex",
    '^(ox)en$': "$1",
    '(alias)es$': "$1",
    '(octop|vir)i$': "$1us",
    '(cris|ax|test)es$': "$1is",
    '(shoe)s$': "$1",
    '(o)es$': "$1",
    '(bus)es$': "$1",
    '([m|l])ice$': "$1ouse",
    '(x|ch|ss|sh)es$': "$1",
    '(m)ovies$': "$1ovie",
    '(s)eries$': "$1eries",
    '([^aeiouy]|qu)ies$': "$1y",
    '([lr])ves$': "$1f",
    '(tive)s$': "$1",
    '(hive)s$': "$1",
    '(li|wi|kni)ves$': "$1fe",
    '(shea|loa|lea|thie)ves$': "$1f",
    '(^analy)ses$': "$1sis",
    '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",
    '([ti])a$': "$1um",
    '(n)ews$': "$1ews",
    '(h|bl)ouses$': "$1ouse",
    '(corpse)s$': "$1",
    '(us)es$': "$1",
    's$': ""
};
var irregular = {
    'move': 'moves',
    'foot': 'feet',
    'goose': 'geese',
    'sex': 'sexes',
    'child': 'children',
    'man': 'men',
    'tooth': 'teeth',
    'person': 'people'
};
String.prototype.plural = function(revert) {
    var uncountable = ['sheep', 'fish', 'deer', 'moose', 'series', 'species', 'money', 'rice', 'information', 'equipment'];
    if (uncountable.indexOf(this.toLowerCase()) >= 0)
        return this;
    for (word in irregular) {
        if (revert) {
            var pattern = new RegExp(irregular[word] + '$', 'i');
            var replace = word;
        } else {
            var pattern = new RegExp(word + '$', 'i');
            var replace = irregular[word];
        }
        if (pattern.test(this))
            return this.replace(pattern, replace);
    }
    if (revert)
        var array = singular;
    else
        var array = plural;
    for (reg in array) {
        var pattern = new RegExp(reg, 'i');
        if (pattern.test(this))
            return this.replace(pattern, array[reg]);
    }
    return String(this);
}

String.lower = function(string) {
    return string.toLowerCase()
}

String.uper = function(string) {
    return string.toUperCase()
}

String.prototype.ucfirst = function() {
    return String.ucfirst(this)

}

String.ucfirst = function(string) {
    return string[0].toUpperCase() + string.slice(1);
}

String.capitalize = function(string) {
    return lodash.capitalize(string)
}

String.isString = function(content) {
    return typeof content == 'string'
}

String.prototype.capitalize = function() {
    return this.capitalize(...arguments)
}

String.prototype.pascal = function() {
    return String.pascal(this)
};

String.pascal = function(string) {
    return string
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(
            new RegExp(/\s+(.)(\w+)/, 'g'),
            ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
        )
        .replace(new RegExp(/\s/, 'g'), '')
        .replace(new RegExp(/\w/), s => s.toUpperCase());
}

String.camelCase = function(string) {
    return lodash.camelCase(string)
}

String.prototype.camelCase = function() {
    return String.camelCase(this)
}

String.studly = function(string) {
    return String.pascal(string)
}

String.prototype.studly = function() {
    return String.studly(this)
}

String.deburr = function(string) {
    return lodash.deburr(string)
}

String.prototype.deburr = function() {
    return String.deburr(this)
}

String.endsWith = function(string, target, position) {
    return lodash.endsWith(string, target, position)
}

String.prototype.endsWith = function(target, position) {
    return String.endsWith(this, target, position)
}

String.escape = function(string) {
    return lodash.escape(string)
}

String.prototype.escape = function() {
    return String.escape(this)
}

String.escapeRegExp = function(string) {
    return lodash.escapeRegExp(string)
}

String.prototype.escapeRegExp = function() {
    return String.escapeRegExp(this)
}

String.kebabCase = function(string) {
    return lodash.kebabCase(string)
}
String.prototype.kebabCase = function() {
    return String.kebabCase(this)
}

String.lowerFirst = function(string) {
    return lodash.lowerFirst(string)
}
String.prototype.lowerFirst = function() {
    return String.lowerFirst(this)
}

String.pad = function(string, length, char) {
    return lodash.pad(string, length, char)
}

String.prototype.pad = function(length, char) {
    return String.pad(this, length, char)
}

String.padEnd = function(string, length, char) {
    return lodash.padEnd(string, length, char)
}

String.prototype.padEnd = function(length, char) {
    return String.padEnd(this, length, char)
}

String.padStart = function(string, length, char) {
    return lodash.padStart(string, length, char)
}

String.prototype.padStart = function(length, char) {
    return String.padStart(this, length, char)
}

String.repeat = function(string, n) {
    return lodash.repeat(string, n)
}

String.prototype.repeat = function(n) {
    return String.repeat(this, n)
}

String.startCase = function(string) {
    return lodash.startCase(string)
}
String.prototype.startCase = function() {
    return String.startCase(this)
}

String.snake = function(string) {
    return String.snakeCase(string)
}
String.prototype.snake = function() {
    return String.snakeCase(this)
}

String.snakeCase = function(string) {
    return lodash.snakeCase(string)
}

String.prototype.snakeCase = function() {
    return String.snakeCase(this)
}

String.startsWith = function(string, target, position) {
    return lodash.startsWith(string, target, position)
}
String.prototype.startsWith = function(target, position) {
    return String.startsWith(this, target, position)
}

String.template = function(string, data = {}, options = {}) {
    options.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    return _.template(string)(replace)
}

String.truncate = function(string, options = {}) {
    return lodash.truncate(string, options = {})
}

String.prototype.truncate = function(options = {}) {
    return String.truncate(this, options = {})
}

String.upperFirst = function(string) {
    return lodash.upperFirst(string)
}

String.prototype.upperFirst = function() {
    return String.upperFirst(this)
}

String.words = function(string) {
    return lodash.words(string)
}
String.prototype.words = function() {
    return String.words(this)
}

String.replace = function(string, pattern, replacement) {
    return lodash.replace(string, pattern, replacement)
}
String.replaceFirst = function(string, pattern, replacement) {
    return String.replace(string, new RegExp(pattern.replace(/\\/ig, '\\\\'), "g"), replacement)
}
String.prototype.replaceFirst = function(pattern, replacement) {
    return String.replaceFirst(this, pattern, replacement)
}
String.replaceAll = function(string, pattern, replacement) {
    if (Array.isArray(pattern)) {
        for (var i = 0; i < pattern.length; i++) {
            string = String.replace(string, new RegExp(pattern[i].replace(/\\/ig, '\\\\'), "ig"), replacement)
        }
    } else {
        string = String.replace(string, new RegExp(pattern.replace(/\\/ig, '\\\\'), "ig"), replacement)

    }
    return string
}

String.prototype.replaceAll = function(pattern, replacement) {
    return String.replaceAll(this, pattern, replacement)
}

String.prototype.replaceArray = function(find, replace) {
    return String.replaceArray(this, find, replace)
};

String.replaceArray = function(string, find, replace) {
    for (var i = 0; i < find.length; i++) {
        string = string.replace(find[i], replace[i]);
    }
    return string;
}

String.prototype.replaceAllArray = function(find, replace) {
    return String.replaceAllArray(this, find, replace)
};

String.replaceAllArray = function(string, find, replace) {
    for (var i = 0; i < find.length; i++) {
        string = string.replaceAll(find[i], replace[i]);
    }
    return string;
}

String.trim = function(string = '', chars) {
    return lodash.trim(string, chars)
}
String.finish = function(string = '', finished = '') {
    if (!string.endsWith(finished)) {
        string = string + finished
    }
    return string

}
String.prototype.finish = function(word) {
    return String.finish(this, word)
}

String.after = function(string = '', after = '') {
    return string.replace(new RegExp('(.*)' + after), "");

}
String.prototype.after = function(after) {
    return String.after(this, after)
}

String.includes = function(string = '', words) {
    return string.includes(words)
}
String.contains = function() {
    return String.includes(...arguments)
}