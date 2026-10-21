import AccessDeniedHttpException from '../src/exceptions/accessDeniedHttpException';
import HttpException from '../src/exceptions/httpException';
import InvalidArgumentException from '../src/exceptions/invalidArgumentException';
import InvalidDataTypeException from '../src/exceptions/invalidDataTypeException';
import LogicException from '../src/exceptions/logicException';
import MethodNotAvailable from '../src/exceptions/methodNotAvailable';
import MixException from '../src/exceptions/mixException';
import PageNotFoundException from '../src/exceptions/pageNotFoundException';
import RuntimeException from '../src/exceptions/runtimeException';
import UnauthenticatedException from '../src/exceptions/unauthenticatedException';
import UnpossibleEntityException from '../src/exceptions/unpossibleEntityException';

describe('exceptions', () => {
    test('AccessDeniedHttpException sets name and message', () => {
        const err = new AccessDeniedHttpException('Access denied');
        expect(err.name).toBe('AccessDeniedHttpException');
        expect(err.message).toBe('Access denied');
        expect(err.stack).toBeDefined();
    });

    test('HttpException sets errors and status (with default status fallback)', () => {
        const err1 = new HttpException('Bad error', 400);
        expect(err1.name).toBe('HttpException');
        expect(err1.errors).toBe('Bad error');
        expect(err1.status).toBe(400);

        const err2 = new HttpException('Default error');
        expect(err2.status).toBe(500);
    });

    test('InvalidArgumentException sets code, status, and message (with default fallback)', () => {
        const err1 = new InvalidArgumentException('Custom invalid arg');
        expect(err1.name).toBe('InvalidArgumentException');
        expect(err1.code).toBe('ERR_INVALID_ARG_VALUE');
        expect(err1.message).toBe('Custom invalid arg');
        expect(err1.statusCode).toBe(500);

        const err2 = new InvalidArgumentException();
        expect(err2.message).toBe('Invalid Argument');
    });

    test('InvalidDataTypeException sets status and message (with default fallback)', () => {
        const err1 = new InvalidDataTypeException('Wrong type');
        expect(err1.name).toBe('InvalidClassException');
        expect(err1.message).toBe('Wrong type');
        expect(err1.statusCode).toBe(500);

        const err2 = new InvalidDataTypeException();
        expect(err2.message).toBe('Invalid Data Type');
    });

    test('LogicException sets code, status, and message', () => {
        const err = new LogicException('Logical flaw');
        expect(err.name).toBe('LogicException');
        expect(err.code).toBe('LOGIC_ERROR');
        expect(err.message).toBe('Logical flaw');
        expect(err.statusCode).toBe(500);
    });

    test('MethodNotAvailable sets status and message', () => {
        const err = new MethodNotAvailable('Method not allowed');
        expect(err.name).toBe('MethodNotAvailable');
        expect(err.message).toBe('Method not allowed');
        expect(err.statusCode).toBe(500);
    });

    test('MixException sets status and message', () => {
        const err = new MixException('Mix manifest missing');
        expect(err.name).toBe('MixException');
        expect(err.message).toBe('Mix manifest missing');
        expect(err.statusCode).toBe(500);
    });

    test('PageNotFoundException sets error and statusCode 404', () => {
        const err = new PageNotFoundException('Route /abc not found');
        expect(err.name).toBe('PageNotFoundException');
        expect(err.error).toBe('Route /abc not found');
        expect(err.statusCode).toBe(404);
    });

    test('RuntimeException sets status and message (with default fallback)', () => {
        const err1 = new RuntimeException('Crash');
        expect(err1.name).toBe('RuntimeException');
        expect(err1.message).toBe('Crash');
        expect(err1.statusCode).toBe(500);

        const err2 = new RuntimeException();
        expect(err2.message).toBe('Runtime Error');
    });

    test('UnauthenticatedException sets status 401 and message (with default fallback)', () => {
        const err1 = new UnauthenticatedException('Not logged in');
        expect(err1.name).toBe('UnauthenticatedException');
        expect(err1.message).toBe('Not logged in');
        expect(err1.statusCode).toBe(401);

        const err2 = new UnauthenticatedException();
        expect(err2.message).toBe('Unauthenticated');
    });

    test('UnpossibleEntityException sets status 422 and message (with default fallback)', () => {
        const err1 = new UnpossibleEntityException('Unprocessable data');
        expect(err1.name).toBe('UnpossibleEntityException');
        expect(err1.message).toBe('Unprocessable data');
        expect(err1.statusCode).toBe(422);

        const err2 = new UnpossibleEntityException();
        expect(err2.message).toBe('Unpossible Entity Exception');
    });
});
