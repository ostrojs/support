import HttpExceptionContract from '@ostro/contracts/http/httpException';

/**
 * Class HttpException.
 */
class HttpException extends HttpExceptionContract {
    public declare name: string;
    public declare message: string;
    public errors: any;
    public status: number | boolean;

    /**
     * Create a new instance.
     * @param errors - The errors payload.
     * @param status - The HTTP status code or flag.
     */
    constructor(errors?: any, status?: number | boolean) {
        super();
        this.name = this.constructor.name;
        this.message = 'Error happend';
        this.errors = errors;
        this.status = status || 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default HttpException;