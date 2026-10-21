import lodash from 'lodash';
import { Macroable } from './macro';
import CollectionInterface from '@ostro/contracts/collection/collect';
import type { ICollection } from '@ostro/contracts/collection/collect';

const kUpdateData: unique symbol = Symbol('update');

/**
 * Class Collection.
 */
class Collection<T = any> extends Macroable.extend(CollectionInterface) implements ICollection<T> {
	$items: T[];
	length: number;

	/**
	 * Create a new instance.
	 * @param {*} data
	 */
	constructor(data) {
		super()
		this.$items = data;
		this.length = data.length;
	}
	/**
	 * make method.
	 * @static
	 * @param {*} data
	 * @returns {any}
	 */
	static make(data) {
		return new this(data)
	}
	/**
	 * collect method.
	 * @static
	 * @param {*} data
	 * @returns {any}
	 */
	static collect(data) {
		return this.make(data)
	}
	/**
	 * map method.
	 * @param {*} cb
	 * @returns {any}
	 */
	map(cb) {
		return this[kUpdateData](lodash.flatMap(this.$items, cb))

	}

	/**
	 * forEach method.
	 * @param {*} cb
	 * @returns {any}
	 */
	forEach(cb) {
		return this[kUpdateData](lodash.forEach(this.$items, cb))
	}

	/**
	 * flatMap method.
	 * @param {*} iteratee
	 * @param {*} depth
	 * @returns {any}
	 */
	flatMap(iteratee, depth = 1) {
		return this[kUpdateData](lodash.flatMapDepth(this.$items, iteratee, depth))
	}

	/**
	 * flatten method.
	 * @param {*} depth
	 * @returns {any}
	 */
	flatten(depth = 1) {
		return this[kUpdateData](lodash.flattenDepth(this.$items, depth))
	}

	/**
	 * sortBy method.
	 * @param {*} iteratees
	 * @returns {any}
	 */
	sortBy(iteratees) {
		return this[kUpdateData](lodash.sortBy(this.$items, iteratees))
	}


	/**
	 * reject method.
	 * @param {*} predicate
	 * @returns {any}
	 */
	reject(predicate) {
		return this[kUpdateData](lodash.reject(this.$items, predicate))
	}

	/**
	 * unique method.
	 * @returns {any}
	 */
	unique() {
		return this[kUpdateData](lodash.uniq(this.$items))
	}

	/**
	 * where method.
	 * @param {*} clause
	 * @param {*} value
	 * @returns {any}
	 */
	where(clause: any, value?: any) {
		clause = typeof clause == 'string' ? { [clause]: value } : clause;
		return this[kUpdateData](lodash.filter(this.$items, clause))
	}

	/**
	 * only method.
	 * @returns {any}
	 */
	only(...keys: any[]) {
		return this.index(...keys)
	}

	/**
	 * mapWithKeys method.
	 * @param {*} callback
	 * @returns {any}
	 */
	mapWithKeys(callback) {
		const mappedItems = {};
		lodash.forEach(this.$items, (value, key) => {
			const result = callback(value, key);
			if (Array.isArray(result) && result.length === 2) {
				const newKey = result[0];
				const newValue = result[1];
				mappedItems[newKey] = newValue;
			}
		});

		return this[kUpdateData](mappedItems);
	}

	/**
	 * take method.
	 * @param {*} clause
	 * @param {*} position
	 * @returns {any}
	 */
	take(clause, position = 'left') {
		if (!['left', 'right'].includes(position)) {
			throw Error('Only left or right are allowed.')
		}
		position = position == 'left' ? 'take' : 'takeRight';
		return this[kUpdateData](lodash[position](this.$items, clause))
	}

	/**
	 * index method.
	 * @param {*} clause
	 * @returns {any}
	 */
	index(...clause: any[]) {
		return this[kUpdateData](lodash[((typeof clause[0] == 'function') ? 'pickBy' : 'pick')](this.$items, clause.length === 1 ? clause[0] : clause))
	}

	/**
	 * reduce method.
	 * @param {*} clause
	 * @param {*} init
	 * @returns {any}
	 */
	reduce(clause: any, init: any = 0): any {
		return this[kUpdateData](lodash.reduce(this.$items, clause, init))
	}

	/**
	 * chunk method.
	 * @param {*} devide
	 * @returns {any}
	 */
	chunk(devide) {
		return this[kUpdateData](lodash.chunk(this.$items, devide))
	}


	/**
	 * concat method.
	 * @param {*} arr
	 * @returns {any}
	 */
	concat(arr) {
		return this[kUpdateData](Array.isArray(this.$items) ? this.$items.concat(arr) : lodash.concat(this.$items, arr))
	}

	/**
	 * contains method.
	 * @param {*} clause
	 * @returns {any}
	 */
	contains(clause) {
		return lodash.includes(this.$items, clause)
	}

	/**
	 * count method.
	 * @returns {any}
	 */
	count() {
		return lodash.size(this.$items)
	}

	/**
	 * countBy method.
	 * @param {*} clause
	 * @returns {any}
	 */
	countBy(clause) {
		return lodash.countBy(this.$items, clause)
	}

	/**
	 * difference method.
	 * @param {*} array
	 * @returns {any}
	 */
	difference(array) {
		return this[kUpdateData](lodash.difference(this.$items, array))
	}

	/**
	 * differenceBy method.
	 * @param {*} array
	 * @param {*} clause
	 * @returns {any}
	 */
	differenceBy(array, clause) {
		return this[kUpdateData](lodash.differenceBy(this.$items, array, clause))
	}

	/**
	 * differenceWith method.
	 * @param {*} array
	 * @param {*} clause
	 * @returns {any}
	 */
	differenceWith(array, clause) {
		return this[kUpdateData](lodash.differenceWith(this.$items, array, clause))
	}


	/**
	 * filter method.
	 * @param {*} clause
	 * @returns {any}
	 */
	filter(clause) {
		return this[kUpdateData](lodash.filter(this.$items, clause))
	}


	/**
	 * groupBy method.
	 * @param {*} clause
	 * @returns {any}
	 */
	groupBy(clause) {
		return this[kUpdateData](lodash.groupBy(this.$items, clause))
	}

	/**
	 * has method.
	 * @param {*} clause
	 * @returns {any}
	 */
	has(clause) {
		return lodash.has(this.$items, clause)
	}

	/**
	 * keys method.
	 * @returns {any}
	 */
	keys() {
		return this[kUpdateData](lodash.keys(this.$items))
	}

	/**
	 * max method.
	 * @param {*} clause
	 * @returns {any}
	 */
	max(clause) {
		return lodash[(clause) ? 'maxBy' : 'max'](this.$items, clause)
	}

	/**
	 * min method.
	 * @param {*} clause
	 * @returns {any}
	 */
	min(clause) {
		return lodash[(clause) ? 'minBy' : 'min'](this.$items, clause)
	}

	/**
	 * pull method.
	 * @returns {any}
	 */
	pull() {
		return this[kUpdateData](lodash.pull(this.$items, ...arguments))
	}

	/**
	 * join method.
	 * @param {*} clause
	 * @returns {any}
	 */
	join(clause) {
		return this[kUpdateData](lodash.join(this.$items, clause))
	}

	/**
	 * isEmpty method.
	 * @returns {any}
	 */
	isEmpty() {
		return this[kUpdateData](lodash.isEmpty(this.$items))
	}

	/**
	 * isNotEmpty method.
	 * @returns {any}
	 */
	isNotEmpty() {
		return this[kUpdateData](!lodash.isEmpty(this.$items))
	}

	/**
	 * intersection method.
	 * @param {*} array
	 * @returns {any}
	 */
	intersection(array) {
		return this[kUpdateData](lodash.intersection(this.$items, array))
	}

	/**
	 * intersectionBy method.
	 * @param {*} array
	 * @param {*} clause
	 * @returns {any}
	 */
	intersectionBy(array, clause) {
		return this[kUpdateData](lodash.intersectionBy(this.$items, array, clause))
	}

	/**
	 * keyBy method.
	 * @param {*} clause
	 * @returns {any}
	 */
	keyBy(clause) {
		return this[kUpdateData](lodash.keyBy(this.$items, clause))
	}

	/**
	 * pluck method.
	 * @param {*} first
	 * @param {*} second
	 * @returns {any}
	 */
	pluck(first: any, second?: any) {
		let results: any = second ? {} : [];
		for (let data of this.$items) {
			if (second) {
				results[lodash.get(data, second)] = lodash.get(data, first)
			} else {
				results.push(lodash.get(data, first))
			}
		}
		return this[kUpdateData](results)
	}

	/**
	 * push method.
	 * @returns {any}
	 */
	push() {
		return this[kUpdateData](lodash.concat(this.$items, ...arguments))
	}

	/**
	 * prepend method.
	 * @returns {any}
	 */
	prepend() {
		return this[kUpdateData](lodash.concat(...arguments, this.$items))
	}

	/**
	 * put method.
	 * @param {*} key
	 * @param {*} value
	 * @returns {any}
	 */
	put(key, value) {
		return this[kUpdateData](lodash.assign(this.$items, {
			[key]: value
		}))
	}

	/**
	 * shuffle method.
	 * @returns {any}
	 */
	shuffle() {
		return this[kUpdateData](lodash.shuffle(this.$items))
	}

	/**
	 * without method.
	 * @returns {any}
	 */
	without() {
		return this[kUpdateData](lodash.without(this.$items, ...arguments))
	}

	/**
	 * skip method.
	 * @param {*} end
	 * @returns {any}
	 */
	skip(end) {
		return this[kUpdateData](lodash.slice(this.$items, 0, end))
	}

	/**
	 * slice method.
	 * @param {*} index
	 * @param {*} end
	 * @returns {any}
	 */
	slice(index, end) {
		return this[kUpdateData](lodash.slice(this.$items, index, end))
	}

	/**
	 * first method.
	 * @returns {any}
	 */
	first() {
		return lodash.head(this.$items);
	}

	/**
	 * last method.
	 * @returns {any}
	 */
	last() {
		return lodash.last(this.$items);
	}

	/**
	 * firstWhere method.
	 * @param {*} clause
	 * @returns {any}
	 */
	firstWhere(clause) {
		return this.where(clause).first()
	}

	/**
	 * get method.
	 * @param {*} clause
	 * @returns {any}
	 */
	get(clause) {
		return this[kUpdateData](lodash.get(this.$items, clause))
	}

	/**
	 * values method.
	 * @returns {any}
	 */
	values() {
		return this[kUpdateData](lodash.values(this.$items))
	}

	/**
	 * all method.
	 * @returns {any}
	 */
	all() {
		return this.$items
	}

	/**
	 * toArray method.
	 * @returns {any}
	 */
	toArray() {
		return this.all();
	}

	/**
	 * toJSON method.
	 * @returns {any}
	 */
	toJSON() {
		return { ...this.all() };
	}

	/**
	 * toJson method.
	 * @returns {any}
	 */
	toJson() {
		return this.toJSON();
	}

	/**
	 * isArray method.
	 * @returns {any}
	 */
	isArray() {
		return Array.isArray(this.$items);
	}
	/**
	 * isJson method.
	 * @returns {any}
	 */
	isJson() {
		return this.$items && typeof this.$items === 'object' && !Array.isArray(this.$items);
	}

	/**
	 * serialize method.
	 * @returns {any}
	 */
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
	[kUpdateData](data: any) {
		return new (this.constructor as any)(data)
	}

	/**
	 * __get method.
	 * @param {*} target
	 * @param {*} method
	 * @returns {any}
	 */
	__get(target, method) {
		return target.$items[method]
	}

}

export default Collection;
