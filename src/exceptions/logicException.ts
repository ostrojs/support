/**
 * Class LogicException.
 */
class LogicException extends Error {
    public code: string;
    public statusCode: number;

    /**
     * Create a new instance.
     * @param message - The error message.
     */
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        this.code = 'LOGIC_ERROR';
        this.message = message;
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default LogicException;