const InvalidClassExceptionContract = require('@ostro/contracts/exception/invalidDataTypeException')
class InvalidClassException extends InvalidClassExceptionContract {
    constructor(message) {
        super();
        this.name = this.constructor.name;
        this.message = message || 'Invalid Data Type';
        this.statusCode = 500
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = InvalidClassException