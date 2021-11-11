const InvalidArgumentExceptionContract = require('@ostro/contracts/exception/invalidArgumentException')
class InvalidArgumentException extends InvalidArgumentExceptionContract {
    constructor(message) {
        super();
        this.name = this.constructor.name;
        this.code = 'ERR_INVALID_ARG_VALUE';
        this.message = message || 'Invalid Argument';
        this.statusCode = 500
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = InvalidArgumentException