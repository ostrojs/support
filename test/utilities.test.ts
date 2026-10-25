import { describe, test, expect } from "@jest/globals";
import '../src/object';
import Env from '../src/env';
import Input from '../src/input';
import ErrorBag from '../src/errorBag';
import MessageBag from '../src/messageBag';
import InteractsWithTime from '../src/interactsWithTime';
import DateTime from '../src/dateTime';

describe('Utility classes (env, input, errorBag, messageBag, object, interactsWithTime)', () => {
    describe('Env', () => {
        test('get and set', () => {
            Env.set('TEST_OSTRO_KEY', 'my-val');
            expect(Env.get('TEST_OSTRO_KEY')).toBe('my-val');
            expect(Env.get('NON_EXISTENT_KEY', 'default_val')).toBe('default_val');
            expect(Env.get('NON_EXISTENT_KEY_2')).toBeNull();
            delete process.env.TEST_OSTRO_KEY;
        });
    });

    describe('Input', () => {
        test('get with key and fallback', () => {
            const input = new Input({ username: 'ostrouser', nested: { role: 'admin' } });
            expect(input.get('username')).toBe('ostrouser');
            expect(input.get('nested.role')).toBe('admin');
            expect(input.get('missing', 'fallback')).toBe('fallback');
            expect(input.get('missing')).toBeNull();
        });
    });

    describe('ErrorBag', () => {
        test('add, get, first, has', () => {
            const bag = new ErrorBag({ email: ['Email is invalid', 'Email is taken'] });
            expect(bag.has('email')).toBe(true);
            expect(bag.has('missing')).toBe(false);

            expect(bag.get('email')).toEqual(['Email is invalid', 'Email is taken']);
            expect(bag.get('missing', 'none')).toBe('none');

            expect(bag.first('email')).toBe('Email is invalid');
            expect(bag.first('missing', 'default_first')).toBe('default_first');

            bag.add('phone', 'Phone is required');
            expect(bag.get('phone')).toBe('Phone is required');
            expect(bag.first('phone')).toBe('Phone is required');
        });
    });

    describe('MessageBag', () => {
        test('add, get, first, has, all', () => {
            const initial = { info: ['Welcome to Ostro', 'Enjoy!'] };
            const bag = new MessageBag(initial);

            expect(bag.has('info')).toBe(true);
            expect(bag.has('warning')).toBe(false);

            expect(bag.get('info')).toEqual(['Welcome to Ostro', 'Enjoy!']);
            expect(bag.get('missing', 'fallback')).toBe('fallback');

            expect(bag.first('info')).toBe('Welcome to Ostro');
            expect(bag.first('missing', 'default_msg')).toBe('default_msg');

            bag.add('alert', 'System update pending');
            expect(bag.get('alert')).toBe('System update pending');
            expect(bag.first('alert')).toBe('System update pending');

            expect(bag.all()).toBe(initial);
        });
    });

    describe('Object extensions', () => {
        test('Object.filter with callback and without callback', () => {
            const obj1 = { a: 1, b: 0, c: 3 };
            const res1 = Object.filter(obj1, (val) => val > 1);
            expect(res1).toEqual({ c: 3 });

            const obj2 = { a: true, b: false, c: 'hello', d: '' };
            const res2 = Object.filter(obj2);
            expect(res2).toEqual({ a: true, c: 'hello' });
        });

        test('Object.except', () => {
            const proto = { inheritedProp: 99 };
            const obj = Object.create(proto);
            Object.assign(obj, { a: 1, b: 2, c: 3, d: 4 });
            const res = Object.except(obj, ['b', 'd']);
            expect(res).toEqual({ a: 1, c: 3 });
        });

        test('Object.flip', () => {
            const source = {
                a: 'first',
                b: 'second',
                nested: {
                    c: 'third',
                    d: 'fourth'
                }
            };
            const flipped = Object.flip(source);
            expect(flipped).toEqual({
                first: 'a',
                second: 'b',
                nested: {
                    third: 'c',
                    fourth: 'd'
                }
            });
        });
    });

    describe('InteractsWithTime', () => {
        test('currentTime, secondsUntil, availableAt with number and DateTime', () => {
            const helper = new InteractsWithTime();
            const now = helper.currentTime();
            expect(typeof now).toBe('number');

            expect(helper.secondsUntil(60)).toBe(60);

            const dt = DateTime.now().addSeconds(10);
            expect(helper.secondsUntil(dt)).toBeGreaterThanOrEqual(9);

            const pastDt = DateTime.now().addSeconds(-10);
            expect(helper.secondsUntil(pastDt)).toBe(0);

            const availFromInt = helper.availableAt(60);
            expect(availFromInt).toBeGreaterThanOrEqual(now + 59);

            const availDefault = helper.availableAt();
            expect(availDefault).toBeGreaterThanOrEqual(now);

            const targetDt = DateTime.now().addSeconds(30);
            const availFromDt = helper.availableAt(targetDt);
            expect(availFromDt).toBe(targetDt.getTimestamp());
        });
    });
});
