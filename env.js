class Env {
    static get(key, defaultValue = null) {
        return process.env[key] || defaultValue;
    }
    static set(key, value) {
        process.env[key] = value;
    }
}

module.exports = Env