const RedirectResponse = require('@ostro/http/redirectResponse')
const { Macroable } = require('@ostro/support/macro')
class Redirect {
    static __get(target, method) {
        return this.call(new RedirectResponse(), method)
    }
}
module.exports = Macroable(Redirect)