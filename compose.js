const { flatten } = require("array-flatten");

function compose() {
    var handlers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        handlers[_i] = arguments[_i];
    }
    var middleware = generate(handlers);
    return function (req, res, done) { return middleware(null, req, res, done); };
}
exports.compose = compose;

function errors() {
    var handlers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        handlers[_i] = arguments[_i];
    }
    return generate(handlers);
}
exports.errors = errors;

function generate(handlers) {
    var stack = flatten(handlers);
    for (var _i = 0, stack_1 = stack; _i < stack_1.length; _i++) {
        var handler = stack_1[_i];
        if (typeof handler !== 'function') {
            throw new TypeError('Handlers must be a function');
        }
    }
    return function middleware(err, req, res, done) {
        var index = -1;

        function dispatch(pos, err) {
            var handler = stack[pos];
            index = pos;
            if (index === stack.length)
                return done(err);

            function next(err) {
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

                if (index > pos)
                    throw e;
                return next(e);
            }
            return next(err);
        }
        return dispatch(0, err);
    };
}