/**
 * Class UnauthenticatedException.
 */
class UnauthenticatedException {
    public name: string;
    public statusCode: number;
    public message: string;

    /**
     * Create a new instance.
     * @param message - The error message.
     */
    constructor(message?: string) {
        this.name = this.constructor.name;
        this.statusCode = 401;
        this.message = message || 'Unauthenticated';
        Error.captureStackTrace(this, this.constructor);
    }
}

export default UnauthenticatedException;