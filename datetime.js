const { DateTime } = require("luxon");
const InvalidArgumentException = require('./exceptions/invalidArgumentException')
const { Macroable } = require('./macro')
class DateTimeZone extends Macroable {

    static $callable = null;

    static $factory = null;

    static getTimeZone() {
        return process.env.TZ
    }

    static get DATE_TIME() {
        return DateTime.utc().setZone(this.getTimeZone())
    }

    static create($year = 0, $month = 0, $day = 0, $hour = 0, $minute = 0, $second = 0, $tz = null) {
        return DateTime.utc($year, $month, $day, $hour, $minute, $second).setZone($tz || this.getTimeZone())
    }
    static createFromDate($year = null, $month = null, $day = null, $tz = null) {
        return DateTime.utc($year, $month, $day, 0, 0, 0).setZone($tz || this.getTimeZone())
    }
    static createFromFormat($format, $time, $tz = null) {
        return DateTime.fromFormat($time, $format, { setZone: $tz || this.getTimeZone() })
    }
    static createFromTime($hour = 0, $minute = 0, $second = 0, $tz = null) {
        return DateTime.fromFormat($time, $format, { setZone: $tz || this.getTimeZone() })
    }

    static now($tz = null) {
        let date = this.DATE_TIME
        if ($tz)
            date.setZone($tz);
        return date.toFormat('yyyy-MM-dd hh:mm:ss').toString()
    }

    static format(format) {
        return this.DATE_TIME.toFormat(format).toString()
    }

    static use($handler) {
        if (is_callable($handler) && is_object($handler)) {
            return this.useCallable($handler);
        } else if (is_string($handler)) {
            return this.useClass($handler);
        }
        throw new InvalidArgumentException('Invalid date creation handler. Please provide a class name, callable, or Carbon factory.');
    }

    static useDefault() {
        this.$callable = null;
        this.$factory = null;
    }

    static useCallable($callable) {
        this.$callable = $callable;

        this.$factory = null;
    }

    static useClass($dateClass) {
        this.$dateClass = $dateClass;

        this.$factory = null;
        this.$callable = null;
    }

    static useFactory($factory) {
        this.$factory = $factory;

        this.$callable = null;
    }

    __call($target, $method, $parameters) {
        $target = $target.constructor
        if ($target.$callable) {
            return $target.$callable($target[$method](...$parameters));
        }

        if ($target.$factory) {
            return $target.$factory[$method](...$parameters);
        }

        if (method_exists($target, $method) ||
            method_exists($target, 'hasMacro') && $target.hasMacro($method)) {
            return $target[$method](...$parameters);
        }

        let $date = $target[$method](...$parameters);

        if (method_exists($target, 'instance')) {
            return $target.instance($date);
        }

        return $date
    }

}

module.exports = DateTimeZone