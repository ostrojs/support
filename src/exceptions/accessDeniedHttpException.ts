import AccessDeniedHttpExceptionInterface from '@ostro/contracts/http/accessDeniedHttpException';

/**
 * Class AccessDeniedHttpException.
 */
class AccessDeniedHttpException extends Error implements AccessDeniedHttpExceptionInterface {
    /**
     * Create a new instance.
     * @param message - The error message.
     */
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AccessDeniedHttpException;