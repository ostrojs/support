const { groupBy, last, intersection, shuffle, unique, difference } = require('../array');
const { hash_equals } = require('../function');

describe('Array Helper Utilities', () => {
    test('last() returns the last element of an array', () => {
        const arr = [1, 2, 3, 4, 5];
        expect(last.call(arr)).toBe(5);
    });

    test('intersection() finds common elements', () => {
        const arr1 = [1, 2, 3];
        const arr2 = [2, 3, 4];
        expect(intersection.call(arr1, arr2)).toEqual([2, 3]);
    });

    test('difference() returns elements not in the target array', () => {
        const arr1 = [1, 2, 3, 4];
        const arr2 = [2, 4];
        expect(difference.call(arr1, arr2)).toEqual([1, 3]);
    });

    test('hash_equals() compares strings in constant time', () => {
        expect(hash_equals('secret', 'secret')).toBe(true);
        expect(hash_equals('secret', 'wrong')).toBe(false);
        expect(hash_equals('secret', 'secrets')).toBe(false);
        expect(hash_equals(null, 'secret')).toBe(false);
    });
});
