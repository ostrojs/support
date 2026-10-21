/**
 * Class UnpossibleEntityException.
 */
class UnpossibleEntityException {
    public name: string;
    public statusCode: number;
    public message: string;

    /**
     * Create a new instance.
     * @param message - The error message.
     */
    constructor(message?: string) {
        this.name = this.constructor.name;
        this.message = message || 'Unpossible Entity Exception';
        this.statusCode = 422;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default UnpossibleEntityException;