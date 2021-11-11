const AccessDeniedHttpExceptionInterface = require('@ostro/contracts/http/accessDeniedHttpException')
class AccessDeniedHttpException extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = AccessDeniedHttpException