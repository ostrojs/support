class MixException {
    constructor(message) {
        this.name = this.constructor.name;
        this.statusCode = 500;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = MixException