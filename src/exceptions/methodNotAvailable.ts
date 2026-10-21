import MethodNotAvailableContract from '@ostro/contracts/http/methodNotAvailable';

/**
 * Class MethodNotAvailable.
 */
class MethodNotAvailable extends MethodNotAvailableContract {
    public declare name: string;
    public declare message: string;
    public statusCode: number;

    /**
     * Create a new instance.
     * @param message - The error message.
     */
    constructor(message: string) {
        super();
        this.name = this.constructor.name;
        this.message = message;
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default MethodNotAvailable;