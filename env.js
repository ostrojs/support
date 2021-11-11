class Env {
    static get(key, defaultValue = null) {
        process.env[key] || defaultValue
    }
    static set(key, value) {
        process.env[key] = defaultValue
    }
}

module.exports = Env