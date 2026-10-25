import { describe, test, expect } from '@jest/globals';
import Collection from '../src/collection';

describe('Collection', () => {
    test('make, collect, constructor, length, iterator', () => {
        const c1 = Collection.make([1, 2, 3]);
        expect(c1.length).toBe(3);
        expect([...c1]).toEqual([1, 2, 3]);

        const c2 = Collection.collect(['a', 'b']);
        expect(c2.length).toBe(2);
    });

    test('map, forEach, flatMap, flatten, sortBy, reject, unique', () => {
        const c = Collection.make([1, 2, 3, 2]);
        expect(c.map(x => x * 2).all()).toEqual([2, 4, 6, 4]);

        const items = [];
        c.forEach(x => items.push(x));
        expect(items).toEqual([1, 2, 3, 2]);

        const nested = Collection.make([[1], [2, [3]]]);
        expect(nested.flatMap(x => x).all()).toEqual([1, 2, [3]]);
        expect(nested.flatten(2).all()).toEqual([1, 2, 3]);

        expect(c.sortBy().all()).toEqual([1, 2, 2, 3]);
        expect(c.reject(x => x === 2).all()).toEqual([1, 3]);
        expect(c.unique().all()).toEqual([1, 2, 3]);
    });

    test('where and firstWhere', () => {
        const c = Collection.make([
            { id: 1, role: 'admin' },
            { id: 2, role: 'user' },
            { id: 3, role: 'user' }
        ]);
        expect(c.where('role', 'user').count()).toBe(2);
        expect(c.where({ role: 'admin' }).count()).toBe(1);
        expect(c.firstWhere({ role: 'user' })).toEqual({ id: 2, role: 'user' });
    });

    test('mapWithKeys and only', () => {
        const c = Collection.make([
            { id: 10, name: 'Alice' },
            { id: 20, name: 'Bob' }
        ]);
        const mapped = c.mapWithKeys(item => [item.id, item.name]);
        expect(mapped.all()).toEqual({ 10: 'Alice', 20: 'Bob' });

        const objColl = Collection.make({ a: 1, b: 2, c: 3 });
        expect(objColl.only(['a', 'c']).all()).toEqual({ a: 1, c: 3 });
    });

    test('take and invalid position', () => {
        const c = Collection.make([1, 2, 3, 4, 5]);
        expect(c.take(2, 'left').all()).toEqual([1, 2]);
        expect(c.take(2, 'right').all()).toEqual([4, 5]);
        expect(() => {
            c.take(2, 'middle');
        }).toThrow('Only left or right are allowed.');
    });

    test('reduce, chunk, concat, contains, count, countBy', () => {
        const c = Collection.make([1, 2, 3, 4]);
        expect(c.reduce((sum, n) => sum + n, 0).all()).toBe(10);
        expect(c.chunk(2).all()).toEqual([[1, 2], [3, 4]]);
        expect(c.concat([5, 6]).all()).toEqual([1, 2, 3, 4, 5, 6]);
        expect(c.contains(3)).toBe(true);
        expect(c.count()).toBe(4);
        expect(c.countBy(n => n % 2 === 0 ? 'even' : 'odd')).toEqual({ odd: 2, even: 2 });
    });

    test('difference, differenceBy, differenceWith, filter, groupBy, has, keys', () => {
        const c = Collection.make([1, 2, 3, 4]);
        expect(c.difference([2, 4]).all()).toEqual([1, 3]);
        expect(c.differenceBy([2.2, 4.4], Math.floor).all()).toEqual([1, 3]);
        expect(c.differenceWith([2], (a, b) => a === b).all()).toEqual([1, 3, 4]);
        expect(c.filter(n => n > 2).all()).toEqual([3, 4]);
        expect(c.groupBy(n => n % 2).all()).toEqual({ 0: [2, 4], 1: [1, 3] });
        expect(c.has(0)).toBe(true);

        const dict = Collection.make({ x: 10, y: 20 });
        expect(dict.keys().all()).toEqual(['x', 'y']);
    });

    test('max, min, pull, join, isEmpty, intersection, intersectionBy, keyBy', () => {
        const c = Collection.make([5, 1, 9, 3]);
        expect(c.max()).toBe(9);
        expect(c.min()).toBe(1);

        const objColl = Collection.make([{ v: 5 }, { v: 10 }]);
        expect(objColl.max('v')).toEqual({ v: 10 });
        expect(objColl.min('v')).toEqual({ v: 5 });

        expect(c.pull(1, 9).all()).toEqual([5, 3]);
        expect(Collection.make(['a', 'b', 'c']).join('-').all()).toBe('a-b-c');
        expect(Collection.make([]).isEmpty().all()).toBe(true);
        expect(Collection.make([1]).isNotEmpty().all()).toBe(true);

        const c2 = Collection.make([1, 2, 3]);
        expect(c2.intersection([2, 3, 4]).all()).toEqual([2, 3]);
        expect(c2.intersectionBy([2.1, 4.1], Math.floor).all()).toEqual([2]);
        expect(objColl.keyBy('v').all()).toEqual({
            5: { v: 5 },
            10: { v: 10 }
        });
    });

    test('pluck with single key and key-value pair', () => {
        const c = Collection.make([
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' }
        ]);
        expect(c.pluck('name').all()).toEqual(['Alice', 'Bob']);
        expect(c.pluck('name', 'id').all()).toEqual({ 1: 'Alice', 2: 'Bob' });
    });

    test('push, prepend, put, shuffle, without, skip, slice, first, last', () => {
        const c = Collection.make([1, 2, 3]);
        expect(c.push(4).all()).toEqual([1, 2, 3, 4]);
        expect(c.prepend(0).all()).toEqual([0, 1, 2, 3]);
        expect(c.put('extra', 'val').all()).toHaveProperty('extra', 'val');
        expect(c.without(2).all()).toEqual([1, 3]);
        expect(c.skip(2).all()).toEqual([1, 2]);
        expect(c.slice(1, 3).all()).toEqual([2, 3]);
        expect(c.first()).toBe(1);
        expect(c.last()).toBe(3);

        const shuffled = c.shuffle();
        expect(shuffled.count()).toBe(3);
    });

    test('get, values, toArray, toJSON, toJson, isArray, isJson, serialize, __get', () => {
        const c = Collection.make([1, 2, 3]);
        expect(c.get(1).all()).toBe(2);
        expect(c.values().all()).toEqual([1, 2, 3]);
        expect(c.toArray()).toEqual([1, 2, 3]);
        expect(c.toJSON()).toEqual({ 0: 1, 1: 2, 2: 3 });
        expect(c.toJson()).toEqual({ 0: 1, 1: 2, 2: 3 });
        expect(c.isArray()).toBe(true);
        expect(c.isJson()).toBe(false);
        expect(c.serialize()).toEqual([1, 2, 3]);

        const dict = Collection.make({ name: 'Ostro' });
        expect(dict.isArray()).toBe(false);
        expect(dict.isJson()).toBe(true);
        expect(dict.serialize()).toEqual({ name: 'Ostro' });

        expect(dict.__get(dict, 'name')).toBe('Ostro');
    });
});
