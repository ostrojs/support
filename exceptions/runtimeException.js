const RuntimeExceptionContract = require('@ostro/contracts/exception/runtimeException')
class RuntimeException extends RuntimeExceptionContract {
    constructor(message) {
        super();
        this.name = this.constructor.name;
        this.message = message || 'Runtime Error';
        this.statusCode = 500
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = RuntimeException