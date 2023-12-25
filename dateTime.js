const { DateTime: LuxonDateTime } = require("luxon");
const InvalidArgumentException = require('@ostro/support/exceptions/invalidArgumentException');
class DateTime extends Date {
    static DEFAULT_CLASS_NAME = LuxonDateTime;

    static $callable = null;

    static $factory = null;

    static $dateClass = null;

    static getTimeZone() {
        return process.env.TZ
    }

    get DATE_TIME() {
        if (!this.DATE_TIME_CACHED) {
            Object.defineProperty(this, 'DATE_TIME_CACHED', {
                writable: true,
                enumerable: false,
                value: this.constructor.DEFAULT_CLASS_NAME.utc().setZone(this.constructor.getTimeZone())
            })
        }
        return this.DATE_TIME_CACHED
    }

    set DATE_TIME(value) {
        Object.defineProperty(this, 'DATE_TIME_CACHED', {
            writable: true,
            enumerable: false,
            value: value
        })
    }
    constructor(date) {

        super(...arguments);

        if (date instanceof this.constructor || date instanceof LuxonDateTime) {
            this.DATE_TIME = date
        }
        if (date instanceof Date) {
            this.DATE_TIME = this.constructor.DEFAULT_CLASS_NAME.fromISO(date.toISOString())
        }

    }

    create($year = 0, $month = 0, $day = 0, $hour = 0, $minute = 0, $second = 0, $tz = null) {
        return this.constructor.DEFAULT_CLASS_NAME.utc($year, $month, $day, $hour, $minute, $second).setZone($tz || this.constructor.getTimeZone())
    }

    createFromDate($year = null, $month = null, $day = null, $tz = null) {
        return this.constructor.DEFAULT_CLASS_NAME.utc($year, $month, $day, 0, 0, 0).setZone($tz || this.constructor.getTimeZone())
    }

    createFromFormat($format, $time, $tz = null) {
        return this.constructor.DEFAULT_CLASS_NAME.fromFormat($time, $format, { setZone: $tz || this.constructor.getTimeZone() })
    }

    createFromTime($hour = 0, $minute = 0, $second = 0, $tz = null) {
        return this.constructor.DEFAULT_CLASS_NAME.fromFormat($time, $format, { setZone: $tz || this.constructor.getTimeZone() })
    }

    getTime() {
        return this.toString()
    }

    static now() {
        return (new this).now()
    }

    utc() {
        const date = this.constructor.DEFAULT_CLASS_NAME.utc();
        return this.newDate(date)
    }

    now($tz = null) {
        let date = this.constructor.DEFAULT_CLASS_NAME.utc().setZone(this.constructor.getTimeZone())
        if ($tz)
            date = date.setZone($tz);
        return this.newDate(date);
    }

    add(date) {
        let diff = {};
        if (date instanceof this.constructor) {
            diff = date.DATE_TIME.diff(this.DATE_TIME);

        }
        if (date instanceof LuxonDateTime) {
            diff = date.diff(this.DATE_TIME);
        }
        return this.plus(diff.milliseconds)
    }

    plus(obj) {
        const date = this.clone(this.DATE_TIME)
        return this.newDate(date.plus(obj));
    }

    addSeconds(value) {
        return this.plus({ seconds: value });
    }

    addMinutes(value) {
        return this.plus({ minutes: value });
    }

    addHours(value) {
        return this.plus({ hours: value });
    }

    addDays(value) {
        return this.plus({ days: value });
    }

    addWeeks(value) {
        return this.plus({ weeks: value });
    }

    addYears(value) {
        return this.plus({ years: value });
    }

    format(format) {
        return this.DATE_TIME.toFormat(format).toString()
    }

    getTimestamp() {
        return this.DATE_TIME.ts
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
        this.$dateClass = null;
    }

    static useCallable($callable) {
        this.$callable = $callable;
        this.$factory = null;
        this.$dateClass = null;
    }

    static useClass($dateClass) {
        this.$dateClass = $dateClass;
        this.$factory = null;
        this.$callable = null;
    }

    static useFactory($factory) {
        this.$factory = $factory;
        this.$callable = null;
        this.$dateClass = null;
    }

    clone(date) {
        return new this.constructor.DEFAULT_CLASS_NAME(date)
    }

    newDate(date) {
        return new this.constructor(date)
    }

    toString() {
        return this.DATE_TIME.toFormat('yyyy-MM-dd HH:mm:ss');
    }

}

module.exports = DateTime
