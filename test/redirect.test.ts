const _Redirect = require('../src/redirect');
const Redirect = _Redirect.default || _Redirect;
const _RedirectResponse = require('@ostro/http/redirectResponse');
const RedirectResponse = _RedirectResponse.default || _RedirectResponse;

describe('Redirect', () => {
    test('__get proxies calls to RedirectResponse instance', () => {
        const res = Redirect.to('/home');
        expect(res).toBeInstanceOf(RedirectResponse);
    });
});
