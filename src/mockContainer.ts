/**
 * Class MockContainer.
 */
class MockContainer {
    public bindings: Record<string, any> = {};

    /**
     * Resolve an abstract binding from the container.
     *
     * @typeParam T - Expected return type.
     * @param abstract - Binding identifier.
     * @returns The resolved binding or empty object.
     */
    public make<T = any>(abstract: any): T {
        if (typeof this.bindings[abstract] === 'function') {
            return this.bindings[abstract](this);
        }
        return (this.bindings[abstract] || {}) as T;
    }

    /**
     * Bind a concrete value or factory into the container.
     *
     * @param abstract - Binding identifier.
     * @param concrete - Value or factory function.
     */
    public bind(abstract: any, concrete: any): void {
        this.bindings[abstract] = concrete;
    }
}

export default MockContainer;
