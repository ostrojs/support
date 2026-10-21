import InvalidArgumentExceptionContract from '@ostro/contracts/exception/invalidArgumentException';

/**
 * Class InvalidArgumentException.
 */
class InvalidArgumentException extends InvalidArgumentExceptionContract {
    public declare name: string;
    public declare message: string;
    public code: string;
    public statusCode: number;

    /**
     * Create a new instance.
     * @param message - The error message.
     */
    constructor(message?: string) {
        super();
        this.name = this.constructor.name;
        this.code = 'ERR_INVALID_ARG_VALUE';
        this.message = message || 'Invalid Argument';
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default InvalidArgumentException;