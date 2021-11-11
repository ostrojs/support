const Assistant = require('@ostro/console/application')
class ServiceProvider {
    constructor($app){
        this.$app = $app
    }
    boot() {

    }
    
    register() {

    }
    
    callBootingCallbacks() {

    }
    
    callBootedCallbacks() {

    }

    commands($commands) {
        $commands = Array.isArray($commands) ? $commands : arguments
        if ($commands.length) {
            Assistant.addBootstraper(function($artisan) {
                $artisan.resolveCommands($commands);
            });
        }
    }
    
    provides() {
        return []
    }
    
    isDeferred() {
        return false
    }

}
module.exports = ServiceProvider