import MessageBagContracts from '@ostro/contracts/support/messageBag';
import { get as lodashGet, set as lodashSet } from 'lodash';

/**
 * Class MessageBag.
 */
class MessageBag extends MessageBagContracts {
    #message: any;

    /**
     * Create a new instance.
     * @param objects - The initial messages object.
     */
    constructor(objects: any) {
        super();
        this.#message = objects;
    }

    /**
     * Add a message to the bag.
     * @param key - The property path.
     * @param value - The message value.
     * @returns The updated message container.
     */
    public add(key: string, value: any): any {
        return lodashSet(this.#message, key, value);
    }

    /**
     * Get message(s) by key.
     * @param key - The property path.
     * @param defaultValue - Fallback value if key is not found.
     * @returns The resolved message(s) or default.
     */
    public get(key: string, defaultValue: any = null): any {
        return lodashGet(this.#message, key) || defaultValue;
    }

    /**
     * Get the first message for a given key.
     * @param key - The property path.
     * @param defaultValue - Fallback value.
     * @returns The first message or default.
     */
    public first(key: string, defaultValue: any = null): any {
        const data = this.get(key);
        return (Array.isArray(data) ? data[0] : data) || defaultValue;
    }

    /**
     * Check if a message key exists.
     * @param key - The property path.
     * @returns True if message exists, false otherwise.
     */
    public has(key: string): boolean {
        return this.get(key) != undefined;
    }

    /**
     * Get all messages in the bag.
     * @returns The raw messages container.
     */
    public all(): any {
        return this.#message;
    }
}

export default MessageBag;