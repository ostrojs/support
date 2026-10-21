export interface BondOptions {
    include?: (string | RegExp)[];
    exclude?: (string | RegExp)[];
}

const getAllProperties = (object: any): Set<[any, string | symbol]> => {
    const properties = new Set<[any, string | symbol]>();

    do {
        for (const key of Reflect.ownKeys(object)) {
            properties.add([object, key]);
        }
    } while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);

    return properties;
};

/**
 * Bind methods of a class instance to itself.
 *
 * @typeParam T - The object type.
 * @param self - The target instance to bind methods on.
 * @param bond - Optional properties to assign onto the instance.
 * @param options - Options containing include and/or exclude patterns.
 * @returns The bound instance.
 */
function bond<T extends Record<string, any>>(
    self: T,
    bond: Record<string, any> | null = null,
    { include, exclude }: BondOptions = {}
): T {
    const filter = (key: string | symbol): boolean => {
        if (typeof key === 'symbol') {
            return false;
        }
        const match = (pattern: string | RegExp): boolean =>
            typeof pattern === 'string' ? key === pattern : pattern.test(key);

        if (include) {
            return include.some(match);
        }

        if (exclude) {
            return !exclude.some(match);
        }

        return true;
    };

    for (const [object, key] of getAllProperties(self.constructor.prototype)) {
        if (key === 'constructor' || !filter(key)) {
            continue;
        }

        const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
        if (descriptor && typeof descriptor.value === 'function') {
            self[key as keyof T] = (self[key as keyof T] as any).bind(self);
        }
    }
    if (bond != null) {
        Object.assign(self, bond);
    }

    return self;
}

export default bond;