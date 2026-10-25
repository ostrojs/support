import InputContracts from '@ostro/contracts/support/input';
import { get as lodashGet } from 'lodash';

/**
 * Class Input.
 */
class Input extends InputContracts {
    #input: any;

    /**
     * Create a new instance.
     * @param objects - The input data object.
     */
    constructor(objects: any) {
        super();
        this.#input = objects;
    }

    /**
     * Get an input value by key.
     * @typeParam T - Expected return type.
     * @param key - The input key or dot-notated path.
     * @param defaultValue - The fallback default value.
     * @returns The resolved input value or default.
     */
    public get<T = any>(key: string, defaultValue: T | null = null): T {
        return lodashGet(this.#input, key) || defaultValue;
    }
}

export default Input;