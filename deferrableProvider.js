const ServiceProvider = require('./serviceProvider')
class DeferrableProvider extends ServiceProvider {

    isDeferred() {
        return true
    }
}
module.exports = DeferrableProvider