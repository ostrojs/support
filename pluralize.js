const lodash = require('lodash');

var pluralRules = [];
var singularRules = [];
var uncountables = {};
var irregularPlurals = {};
var irregularSingles = {};

function sanitizeRule(rule) {
    return typeof rule === 'string' ? new RegExp('^' + rule + '$', 'i') : rule;
}

function restoreCase(word, token) {
    if (word === token) return token;
    if (word === word.toLowerCase()) return token.toLowerCase();
    if (word === word.toUpperCase()) return token.toUpperCase();
    if (word[0] === word[0].toUpperCase()) return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    return token.toLowerCase();
}

function replaceWordRule(word, rule) {
    return word.replace(rule[0], (match, index, ...args) => {
        var res = rule[1].replace(/\$(\d{1,2})/g, (m, i) => args[i] || '');
        return restoreCase(match || word[index - 1], res);
    });
}

function sanitizeWord(token, word, rules) {
    if (!token.length || lodash.has(uncountables, token)) return word;
    for (let i = rules.length - 1; i >= 0; i--) {
        if (rules[i][0].test(word)) return replaceWordRule(word, rules[i]);
    }
    return word;
}

function replaceWord(replaceMap, keepMap, rules) {
    return function (word) {
        var token = String(word).toLowerCase();
        if (lodash.has(keepMap, token)) return restoreCase(word, token);
        if (lodash.has(replaceMap, token)) return restoreCase(word, replaceMap[token]);
        return sanitizeWord(token, String(word), rules);
    };
}

function addUncountableRule(word) {
    if (typeof word === 'string') {
        uncountables[word.toLowerCase()] = true;
    } else {
        pluralRules.push([word, '$0']);
        singularRules.push([word, '$0']);
    }
}

function addIrregularRule(single, plural) {
    plural = plural.toLowerCase();
    single = single.toLowerCase();
    irregularSingles[single] = plural;
    irregularPlurals[plural] = single;
}

[
    ['I', 'we'],
    ['me', 'us'],
    ['he', 'they'],
    ['she', 'they'],
    ['them', 'them'],
    ['myself', 'ourselves'],
    ['yourself', 'yourselves'],
    ['itself', 'themselves'],
    ['herself', 'themselves'],
    ['himself', 'themselves'],
    ['themself', 'themselves'],
    ['is', 'are'],
    ['was', 'were'],
    ['has', 'have'],
    ['this', 'these'],
    ['that', 'those'],
    ['my', 'our'],
    ['its', 'their'],
    ['his', 'their'],
    ['her', 'their'],
    ['echo', 'echoes'],
    ['dingo', 'dingoes'],
    ['volcano', 'volcanoes'],
    ['tornado', 'tornadoes'],
    ['torpedo', 'torpedoes'],
    ['genus', 'genera'],
    ['viscus', 'viscera'],
    ['stigma', 'stigmata'],
    ['stoma', 'stomata'],
    ['dogma', 'dogmata'],
    ['lemma', 'lemmata'],
    ['schema', 'schemata'],
    ['anathema', 'anathemata'],
    ['ox', 'oxen'],
    ['axe', 'axes'],
    ['die', 'dice'],
    ['yes', 'yeses'],
    ['foot', 'feet'],
    ['eave', 'eaves'],
    ['goose', 'geese'],
    ['tooth', 'teeth'],
    ['quiz', 'quizzes'],
    ['human', 'humans'],
    ['proof', 'proofs'],
    ['carve', 'carves'],
    ['valve', 'valves'],
    ['looey', 'looies'],
    ['thief', 'thieves'],
    ['groove', 'grooves'],
    ['pickaxe', 'pickaxes'],
    ['passerby', 'passersby'],
    ['canvas', 'canvases']
].forEach(function (rule) {
    addIrregularRule(rule[0], rule[1]);
});

pluralRules = [
    [/s?$/i, 's'],
    [/[^\u0000-\u007F]$/i, '$0'],
    [/([^aeiou]ese)$/i, '$1'],
    [/(ax|test)is$/i, '$1es'],
    [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, '$1es'],
    [/(e[mn]u)s?$/i, '$1s'],
    [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, '$1'],
    [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
    [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
    [/(seraph|cherub)(?:im)?$/i, '$1im'],
    [/(her|at|gr)o$/i, '$1oes'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
    [/sis$/i, 'ses'],
    [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
    [/([^aeiouy]|qu)y$/i, '$1ies'],
    [/([^ch][ieo][ln])ey$/i, '$1ies'],
    [/(x|ch|ss|sh|zz)$/i, '$1es'],
    [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
    [/\b((?:tit)?m|l)(?:ice|ouse)$/i, '$1ice'],
    [/(pe)(?:rson|ople)$/i, '$1ople'],
    [/(child)(?:ren)?$/i, '$1ren'],
    [/eaux$/i, '$0'],
    [/m[ae]n$/i, 'men'],
    [sanitizeRule('thou'), 'you']
];

singularRules = [
    [/s$/i, ''],
    [/(ss)$/i, '$1'],
    [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
    [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
    [/ies$/i, 'y'],
    [/(dg|ss|ois|lk|ok|wn|mb|th|ch|ec|oal|is|ck|ix|sser|ts|wb)ies$/i, '$1ie'],
    [/\b(l|(?:neck|cross|hog|aun)?t|coll|faer|food|gen|goon|group|hipp|junk|vegg|(?:pork)?p|charl|calor|cut)ies$/i, '$1ie'],
    [/\b(mon|smil)ies$/i, '$1ey'],
    [/\b((?:tit)?m|l)ice$/i, '$1ouse'],
    [/(seraph|cherub)im$/i, '$1'],
    [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, '$1'],
    [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, '$1sis'],
    [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'],
    [/(test)(?:is|es)$/i, '$1is'],
    [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
    [/(alumn|alg|vertebr)ae$/i, '$1a'],
    [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
    [/(matr|append)ices$/i, '$1ix'],
    [/(pe)(rson|ople)$/i, '$1rson'],
    [/(child)ren$/i, '$1'],
    [/(eau)x?$/i, '$1'],
    [/men$/i, 'man']
];

[
    'adulthood', 'advice', 'agenda', 'aid', 'aircraft', 'alcohol', 'ammo', 'analytics', 'anime',
    'athletics', 'audio', 'bison', 'blood', 'bream', 'buffalo', 'butter', 'carp', 'cash',
    'chassis', 'chess', 'clothing', 'cod', 'commerce', 'cooperation', 'corps', 'debris',
    'diabetes', 'digestion', 'elk', 'energy', 'equipment', 'excretion', 'expertise', 'firmware',
    'flounder', 'fun', 'gallows', 'garbage', 'graffiti', 'hardware', 'headquarters', 'health',
    'herpes', 'highjinks', 'homework', 'housework', 'information', 'jeans', 'justice', 'kudos',
    'labour', 'literature', 'machinery', 'mackerel', 'mail', 'media', 'mews', 'moose', 'music',
    'mud', 'manga', 'news', 'only', 'personnel', 'pike', 'plankton', 'pliers', 'police',
    'pollution', 'premises', 'rain', 'research', 'rice', 'salmon', 'scissors', 'series',
    'sewage', 'shambles', 'shrimp', 'software', 'staff', 'swine', 'tennis', 'traffic',
    'transportation', 'trout', 'tuna', 'wealth', 'welfare', 'whiting', 'wildebeest', 'wildlife',
    'you', /pok[eé]mon$/i, /[^aeiou]ese$/i, /deer$/i, /fish$/i, /measles$/i, /o[iu]s$/i, /pox$/i, /sheep$/i
].forEach(addUncountableRule);

const getPlural = replaceWord(irregularSingles, irregularPlurals, pluralRules);
const getSingular = replaceWord(irregularPlurals, irregularSingles, singularRules);

function plural(string = '', count, inclusive) {
    if (typeof count === 'number') {
        var pluralized = count === 1 ? getSingular(string) : getPlural(string);
        return (inclusive ? count + ' ' : '') + pluralized;
    }
    return getPlural(string);
}

function singular(string = '') {
    return getSingular(string);
}

module.exports = {
    plural,
    singular
};
