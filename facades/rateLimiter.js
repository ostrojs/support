const Facade = require('./facade');
const { Macroable } = require('../macro');
class RateLimiter extends Facade {

    static getFacadeAccessor() {
        return require('@ostro/cache/rateLimiter');
    }
}
module.exports = Macroable(RateLimiter)
