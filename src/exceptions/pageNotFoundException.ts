import PageNotFoundExceptionContract from '@ostro/contracts/http/pageNotFoundException';

/**
 * Class PageNotFoundException.
 */
class PageNotFoundException extends PageNotFoundExceptionContract {
    public declare name: string;
    public declare message: string;
    public error: any;
    public statusCode: number;

    /**
     * Create a new instance.
     * @param error - The error details.
     */
    constructor(error?: any) {
        super();
        this.name = this.constructor.name;
        this.message = 'Page Not Found Exception';
        this.error = error;
        this.statusCode = 404;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default PageNotFoundException;