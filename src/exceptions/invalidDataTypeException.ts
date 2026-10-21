import InvalidClassExceptionContract from '@ostro/contracts/exception/invalidDataTypeException';

/**
 * Class InvalidClassException.
 */
class InvalidClassException extends InvalidClassExceptionContract {
    public declare name: string;
    public declare message: string;
    public statusCode: number;

    /**
     * Create a new instance.
     * @param message - The error message.
     */
    constructor(message?: string) {
        super();
        this.name = this.constructor.name;
        this.message = message || 'Invalid Data Type';
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default InvalidClassException;