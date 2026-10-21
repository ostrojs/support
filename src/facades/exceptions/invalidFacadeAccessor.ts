/**
 * Class InvalidFacadeAccessor.
 */
class InvalidFacadeAccessor {
    public name: string;
    public message: string;
    public status: number;

    /**
     * Create a new instance.
     * @param facadeName - Name or accessor of the invalid facade.
     */
    constructor(facadeName: unknown) {
        this.name = this.constructor.name;
        this.message = `Given facade Accessor [{${facadeName}}] not available`;
        this.status = 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default InvalidFacadeAccessor;