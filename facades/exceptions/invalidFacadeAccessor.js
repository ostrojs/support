class InvalidFacadeAccessor {
    constructor(facadeName) {
        this.name = this.constructor.name;
        this.message = `Given facade Accessor [{${facadeName}}] not available`;
        this.status = 500;
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = InvalidFacadeAccessor