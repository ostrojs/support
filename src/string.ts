import lodash from 'lodash';
import { plural as _plural, singular as _singular } from './pluralize';

export const plural = (...arg: Parameters<typeof _plural>): ReturnType<typeof _plural> => _plural(...arg);
export const singular = (...arg: Parameters<typeof _singular>): ReturnType<typeof _singular> => _singular(...arg);

export function lower(string: any = ''): string {
    return String(string).toLowerCase();
}

export function uper(string: any = ''): string {
    return String(string).toUpperCase();
}

export function ucfirst(string: any = ''): string {
    const str = String(string);
    return str ? str[0].toUpperCase() + str.slice(1) : '';
}

export function capitalize(string: any = ''): string {
    return lodash.capitalize(string);
}

export function isString(content: unknown): content is string {
    return typeof content === 'string';
}

export function pascal(string: any = ''): string {
    return lodash.upperFirst(lodash.camelCase(string));
}

export const camelCase = (...arg: any[]): string => lodash.camelCase(...arg);

export const camel = camelCase;

export const studly = pascal;

export const deburr = (...arg: any[]): string => lodash.deburr(...arg);

export const endsWith = (...arg: any[]): boolean => lodash.endsWith(...arg);

export const escape = (...arg: any[]): string => lodash.escape(...arg);

export const escapeRegExp = (...arg: any[]): string => lodash.escapeRegExp(...arg);

export const kebabCase = (...arg: any[]): string => lodash.kebabCase(...arg);

export const lowerFirst = (...arg: any[]): string => lodash.lowerFirst(...arg);

export const pad = (...arg: any[]): string => lodash.pad(...arg);

export const padEnd = (...arg: any[]): string => lodash.padEnd(...arg);

export const padStart = (...arg: any[]): string => lodash.padStart(...arg);

export const repeat = (...arg: any[]): string => lodash.repeat(...arg);

export const startCase = (...arg: any[]): string => lodash.startCase(...arg);

export const snakeCase = (...arg: any[]): string => lodash.snakeCase(...arg);

export const snake = snakeCase;

export const startsWith = (...arg: any[]): boolean => lodash.startsWith(...arg);

export const truncate = (...arg: any[]): string => lodash.truncate(...arg);

export const upperFirst = (...arg: any[]): string => lodash.upperFirst(...arg);

export const words = (...arg: any[]): string[] => lodash.words(...arg);

export const replace = (...arg: any[]): string => (lodash.replace as any)(...arg);

export function replaceFirst(string: any = '', pattern: string | RegExp = '', replacement: any = ''): string {
    const pStr = typeof pattern === 'string' ? pattern.replace(/\\/ig, '\\\\') : pattern;
    return replace(string, new RegExp(pStr), replacement);
}

export function replaceAll(string: any = '', pattern: (string | RegExp)[] | string | RegExp = '', replacement: any = ''): string {
    let str = String(string);
    if (Array.isArray(pattern)) {
        for (let i = 0; i < pattern.length; i++) {
            const itemStr = typeof pattern[i] === 'string' ? (pattern[i] as string).replace(/\\/ig, '\\\\') : pattern[i];
            str = replace(str, new RegExp(itemStr, 'ig'), replacement);
        }
    } else {
        const pStr = typeof pattern === 'string' ? pattern.replace(/\\/ig, '\\\\') : pattern;
        str = replace(str, new RegExp(pStr, 'ig'), replacement);
    }
    return str;
}

export function replaceArray(string: any = '', find: (string | RegExp)[] = [], replaceWith: any[] = []): string {
    let str = String(string);
    for (let i = 0; i < find.length; i++) {
        str = str.replace(find[i], replaceWith[i]);
    }
    return str;
}

export function replaceAllArray(string: any = '', find: (string | RegExp)[] = [], replaceWith: any[] = []): string {
    let str = String(string);
    for (let i = 0; i < find.length; i++) {
        str = (str as any).replaceAll(find[i], replaceWith[i]);
    }
    return str;
}

export const trim = (...arg: any[]): string => lodash.trim(...arg);

export const trimEnd = (...arg: any[]): string => lodash.trimEnd(...arg);

export function finish(string: any = '', finished: string = ''): string {
    let str = String(string);
    if (!str.endsWith(finished)) {
        str = str + finished;
    }
    return str;
}

export function after(string: any = '', afterStr: string = ''): string {
    return String(string).replace(new RegExp('(.*)' + afterStr), '');
}

export function includes(string: any = '', wordsToInclude: string): boolean {
    return String(string).includes(wordsToInclude);
}

export function contains(...args: [any, string]): boolean {
    return includes(...args);
}

export function pluralStudly(string: any = ''): string {
    const studlyCaseString = camelCase(string);
    return plural(studlyCaseString);
}
