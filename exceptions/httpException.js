const HttpExceptionContract = require('@ostro/contracts/http/httpException')
class HttpException extends HttpExceptionContract {
    constructor(errors,status) {
        super();
        this.name = this.constructor.name;
        this.message = 'Error happend';
        this.errors = errors;
        this.status = status || 500;
        Error.captureStackTrace(this, this.constructor);        
    }
}
module.exports = HttpException