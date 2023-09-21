const lodash = require('lodash')
const { Macroable } = require('./macro')
const CollectionInterface = require('@ostro/contracts/collection/collect')
const kCollection = Symbol('items')
const kDataType = Symbol('datatype')
const kUpdateData = Symbol('update')
class Collection extends Macroable.extend(CollectionInterface) {
    constructor(data) {
        super()
        this.$items = data;
        this.length = data.length;
    }
    static make(data) {
        return new this(data)
    }
    static collect(data) {
        return this.make(data)
    }
    map(cb) {
        return this[kUpdateData](lodash.flatMap(this.$items, cb))

    }

    forEach(cb) {
        return this[kUpdateData](lodash.forEach(this.$items, cb))
    }

    flatMap(iteratee, depth = 1) {
        return this[kUpdateData](lodash.flatMapDepth(this.$items, iteratee, depth))
    }

    flatten(depth = 1) {
        return this[kUpdateData](lodash.flattenDepth(this.$items, depth))
    }

    sortBy(iteratees) {
        return this[kUpdateData](lodash.sortBy(this.$items, iteratees))
    }


    reject(predicate) {
        return this[kUpdateData](lodash.reject(this.$items, predicate))
    }

    unique() {
        return this[kUpdateData](lodash.uniq(this.$items))
    }


    where(clause) {
        return this[kUpdateData](lodash.filter(this.$items, clause))
    }

    take(clause, position = 'left') {
        if (!['left', 'right'].includes(position)) {
            throw Error('Only left or right are allowed.')
        }
        position = position == 'left' ? 'take' : 'takeRight';
        return this[kUpdateData](lodash[position](this.$items, clause))
    }

    index(clause) {
        return this[kUpdateData](lodash[((typeof clause == 'function') ? 'pickBy' : 'pick')](this.$items, clause))
    }

    reduce(clause, init = 0) {
        return this[kUpdateData](lodash.reduce(this.$items, clause, init))
    }

    chunk(devide) {
        return this[kUpdateData](lodash.chunk(this.$items, devide))
    }


    concat(arr) {
        return this[kUpdateData](super.concat(arr))
    }

    contains(clause) {
        return this[kUpdateData](lodash.includes(this.$items, clause))
    }

    count() {
        return this[kUpdateData](lodash.size(this.$items))
    }

    countBy(clause) {
        return this[kUpdateData](lodash.countBy(this.$items, clause))
    }

    difference(array) {
        return this[kUpdateData](lodash.difference(this.$items, array))
    }

    differenceBy(array, clause) {
        return this[kUpdateData](lodash.differenceBy(this.$items, array, clause))
    }

    differenceWith(array, clause) {
        return this[kUpdateData](lodash.differenceWith(this.$items, array, clause))
    }


    filter(clause) {
        return this[kUpdateData](lodash.filter(this.$items, clause))
    }


    groupBy(clause) {
        return this[kUpdateData](lodash.groupBy(this.$items, clause))
    }

    has(clause) {
        return lodash.has(this.$items, clause)
    }

    keys() {
        return this[kUpdateData](lodash.keys(this.$items))
    }

    max(clause) {
        return lodash[(clause) ? 'maxBy' : 'max'](this.$items, clause)
    }

    min() {
        return lodash[(clause) ? 'minBy' : 'min'](this.$items, clause)
    }

    pull() {
        return this[kUpdateData](lodash.pull(this.$items, ...arguments))
    }

    join(clause) {
        return this[kUpdateData](lodash.join(this.$items, clause))
    }

    isEmpty() {
        return this[kUpdateData](lodash.isEmpty(this.$items))
    }

    intersection(array) {
        return this[kUpdateData](lodash.intersection(this.$items, array))
    }

    intersectionBy(array, clause) {
        return this[kUpdateData](lodash.intersectionBy(this.$items, array, clause))
    }

    keyBy(clause) {
        return this[kUpdateData](lodash.keyBy(this.$items, clause))
    }

    pluck(first, second) {
        let results = second ? {} : [];
        for (let data of this.$items) {
            if (second) {
                results[lodash.get(data,second)] = lodash.get(data,first)
            } else {
                results.push(lodash.get(data,first))
            }
        }
        return this[kUpdateData](results)
    }

    push() {
        return this[kUpdateData](lodash.concat(this.$items, ...arguments))
    }

    put(key, value) {
        return this[kUpdateData](lodash.assign(this.$items, {
            [key]: value
        }))
    }

    shuffle() {
        return this[kUpdateData](lodash.shuffle(this.$items))
    }

    without() {
        return this[kUpdateData](lodash.without(this.$items, ...arguments))
    }

    skip(end) {
        return this[kUpdateData](lodash.slice(this.$items, 0, end))
    }

    first() {
        return this[kUpdateData](lodash.head(this.$items))
    }

    last() {
        return this[kUpdateData](lodash.last(this.$items))
    }

    firstWhere(clause) {
        return this.where(clause).first()
    }

    get(clause) {
        return this[kUpdateData](lodash.get(this.$items, clause))
    }

    values() {
        return this[kUpdateData](lodash.values(this.$items))
    }

    all() {
        return this.$items
    }

    toArray() {
        return this.all();
    }

    toJSON() {
        return { ...this.all() };
    }

    toJson() {
        return this.toJSON();
    }

    serialize() {
        let $value = this.all();
        if (Array.isArray($value)) {
            return this.toArray();

        } else {
            return this.toJSON();
        }
    }

    [Symbol.iterator]() {
        let i = 0

        return {
            next: () => {
                if (i < this.length) {
                    return { done: false, value: this.$items[i++] };
                } else {
                    return { done: true };
                }
            }

        };
    }
    [kUpdateData](data) {
        return new this.constructor(data)
    }

    __get(target, method) {
        return target.$items[method]
    }

}

module.exports = Collection