/**
 * Class MixException.
 */
class MixException {
    public name: string;
    public statusCode: number;
    public message: string;

    /**
     * Create a new instance.
     * @param message - The error message.
     */
    constructor(message: string) {
        this.name = this.constructor.name;
        this.statusCode = 500;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default MixException;