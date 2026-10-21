import RuntimeExceptionContract from '@ostro/contracts/exception/runtimeException';

/**
 * Class RuntimeException.
 */
class RuntimeException extends RuntimeExceptionContract {
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
        this.message = message || 'Runtime Error';
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default RuntimeException;