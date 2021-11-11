class UnauthenticatedException {
    constructor(message) {
        this.name = this.constructor.name;
        this.statusCode = 401;
        this.message = message || 'Unauthenticated';
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = UnauthenticatedException