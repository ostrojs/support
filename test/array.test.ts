import { groupBy, last, intersection, shuffle, unique, diff, difference, wrap } from '../src/array';

describe('array', () => {
    test('groupBy groups elements by function or property name', () => {
        const users = [
            { name: 'John', role: 'admin' },
            { name: 'Jane', role: 'user' },
            { name: 'Bob', role: 'admin' }
        ];

        const groupedByProp = groupBy.call(users, 'role');
        expect(groupedByProp.admin).toHaveLength(2);
        expect(groupedByProp.user).toHaveLength(1);

        const groupedByFn = groupBy.call(users, (u: any) => u.role.toUpperCase());
        expect(groupedByFn.ADMIN).toHaveLength(2);
        expect(groupedByFn.USER).toHaveLength(1);
    });

    test('last returns last element or undefined for empty array', () => {
        expect(last.call([10, 20, 30])).toBe(30);
        expect(last.call([])).toBeUndefined();
    });

    test('intersection finds common elements with and without argument', () => {
        expect(intersection.call([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
        expect(intersection.call([1, 2, 3])).toEqual([]);
    });

    test('shuffle shuffles an array', () => {
        const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const shuffled = shuffle.call(original);
        expect(shuffled).toHaveLength(10);
        expect(shuffled.sort()).toEqual(original.sort());
    });

    test('unique returns distinct elements', () => {
        expect(unique.call([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
    });

    test('diff and difference return array difference', () => {
        expect(diff.call([1, 2, 3, 4], [2, 4])).toEqual([1, 3]);
        expect(difference.call([1, 2, 3, 4], [2, 4])).toEqual([1, 3]);
    });

    test('wrap handles null, undefined, arrays, and values', () => {
        expect(wrap(null)).toEqual([]);
        expect(wrap(undefined)).toEqual([]);
        expect(wrap([1, 2])).toEqual([1, 2]);
        expect(wrap('hello')).toEqual(['hello']);
        expect(wrap(42)).toEqual([42]);
    });
});
