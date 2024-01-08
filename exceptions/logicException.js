class LogicException extends Error {
    constructor(message) {
        super();
        this.name = this.constructor.name;
        this.code = 'LOGIC_ERROR';
        this.message = message;
        this.statusCode = 500
    }
}
module.exports = LogicException