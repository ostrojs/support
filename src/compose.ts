export type NextFunction = (err?: any) => any;
export type RequestHandler = (req: any, res: any, next: NextFunction) => any;
export type ErrorRequestHandler = (err: any, req: any, res: any, next: NextFunction) => any;
export type MiddlewareHandler = RequestHandler | ErrorRequestHandler;

/**
 * Flatten nested array of handlers.
 *
 * @param arr - The array or single handler.
 * @returns Flattened array.
 */
function flatten(arr: any): any[] {
    return Array.isArray(arr) ? arr.flat(Infinity) : [arr];
}

/**
 * Generate a composed middleware function from a list of handlers.
 *
 * @param handlers - Handlers to compose.
 * @returns Composed middleware function.
 */
function generate(handlers: any[]) {
    const stack = flatten(handlers);
    for (let i = 0; i < stack.length; i++) {
        const handler = stack[i];
        if (typeof handler !== 'function') {
            throw new TypeError('Handlers must be a function');
        }
    }
    return function middleware(err: any, req: any, res: any, done: (err?: any) => any) {
        let index = -1;

        /**
         * Dispatch handler at the given position.
         *
         * @param pos - Position in the stack.
         * @param err - Error if present.
         * @returns Handler result.
         */
        function dispatch(pos: number, err: any): any {
            const handler = stack[pos];
            index = pos;
            if (index === stack.length) {
                return done(err);
            }

            /**
             * Next handler.
             *
             * @param err - Error if present.
             * @returns Next dispatch result.
             */
            function next(err?: any): any {
                if (pos < index) {
                    throw new TypeError('`next()` called multiple times');
                }
                return dispatch(pos + 1, err);
            }

            try {
                if (handler.length === 4) {
                    if (err) {
                        return handler(err, req, res, next);
                    }
                } else {
                    if (!err) {
                        return handler(req, res, next);
                    }
                }
            } catch (e) {
                if (index > pos) {
                    throw e;
                }
                return next(e);
            }
            return next(err);
        }

        return dispatch(0, err);
    };
}

/**
 * Compose middleware handlers into a single request handler.
 *
 * @param handlers - Middleware handlers.
 * @returns Request handler.
 */
export function compose(...handlers: any[]): (req: any, res: any, done: (err?: any) => any) => any {
    const middleware = generate(handlers);
    return function (req: any, res: any, done: (err?: any) => any) {
        return middleware(null, req, res, done);
    };
}

/**
 * Compose error handlers into an error middleware.
 *
 * @param handlers - Error handlers.
 * @returns Error middleware function.
 */
export function errors(...handlers: any[]): (err: any, req: any, res: any, done: (err?: any) => any) => any {
    return generate(handlers);
}