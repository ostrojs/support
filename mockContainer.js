class MockContainer {
    bindings = {};

    make(abstract) {
        if (typeof this.bindings[abstract] === 'function') {
            return this.bindings[abstract](this);
        }
        return this.bindings[abstract] || {};
    }

    bind(abstract, concrete) {
        this.bindings[abstract] = concrete;
    }
}

module.exports = MockContainer;
