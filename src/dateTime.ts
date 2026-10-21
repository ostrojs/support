import { DateTime as LuxonDateTime } from 'luxon';
import InvalidArgumentException from './exceptions/invalidArgumentException';
import { is_callable, is_string } from './function';

/**
 * Class DateTime.
 */
class DateTime extends Date {
    public static DEFAULT_CLASS_NAME: any = LuxonDateTime;

    public static $callable: any = null;

    public static $factory: any = null;

    public static $dateClass: any = null;

    public DATE_TIME_CACHED?: any;

    /**
     * Get timezone from process environment.
     *
     * @returns Timezone string or undefined.
     */
    public static getTimeZone(): string | undefined {
        return process.env.TZ;
    }

    /**
     * Get underlying DATE_TIME object.
     *
     * @returns Luxon DateTime instance.
     */
    public get DATE_TIME(): any {
        if (!this.DATE_TIME_CACHED) {
            const ctor = this.constructor as typeof DateTime;
            Object.defineProperty(this, 'DATE_TIME_CACHED', {
                writable: true,
                enumerable: false,
                value: ctor.DEFAULT_CLASS_NAME.utc().setZone(ctor.getTimeZone())
            });
        }
        return this.DATE_TIME_CACHED;
    }

    /**
     * Set underlying DATE_TIME object.
     *
     * @param value - Luxon DateTime instance.
     */
    public set DATE_TIME(value: any) {
        Object.defineProperty(this, 'DATE_TIME_CACHED', {
            writable: true,
            enumerable: false,
            value: value
        });
    }

    /**
     * Create a new DateTime instance.
     *
     * @param date - Optional date or DateTime instance.
     */
    constructor(date?: any) {
        super(date);
        const ctor = this.constructor as typeof DateTime;

        if (date instanceof (this.constructor as any) || date instanceof LuxonDateTime) {
            this.DATE_TIME = date;
        }
        if (date instanceof Date) {
            this.DATE_TIME = ctor.DEFAULT_CLASS_NAME.fromISO(date.toISOString());
        }
    }

    /**
     * Create a date with specified parts.
     */
    public create($year: number = 0, $month: number = 0, $day: number = 0, $hour: number = 0, $minute: number = 0, $second: number = 0, $tz: any = null): any {
        const ctor = this.constructor as typeof DateTime;
        return ctor.DEFAULT_CLASS_NAME.utc($year, $month, $day, $hour, $minute, $second).setZone($tz || ctor.getTimeZone());
    }

    /**
     * Create a date from date components.
     */
    public createFromDate($year: any = null, $month: any = null, $day: any = null, $tz: any = null): any {
        const ctor = this.constructor as typeof DateTime;
        return ctor.DEFAULT_CLASS_NAME.utc($year, $month, $day, 0, 0, 0).setZone($tz || ctor.getTimeZone());
    }

    /**
     * Create a date from format string.
     */
    public createFromFormat($format: any, $time: any, $tz: any = null): any {
        const ctor = this.constructor as typeof DateTime;
        return ctor.DEFAULT_CLASS_NAME.fromFormat($time, $format, { setZone: $tz || ctor.getTimeZone() });
    }

    /**
     * Create a date from time components.
     */
    public createFromTime($hour: number = 0, $minute: number = 0, $second: number = 0, $tz: any = null): any {
        const ctor = this.constructor as typeof DateTime;
        const now = ctor.DEFAULT_CLASS_NAME.utc().setZone($tz || ctor.getTimeZone());
        return now.set({ hour: $hour, minute: $minute, second: $second, millisecond: 0 });
    }

    /**
     * Get time as string.
     */
    public getTime(): any {
        return this.toString();
    }

    /**
     * Get current DateTime instance.
     */
    public static now(): any {
        return (new this()).now();
    }

    /**
     * Get UTC DateTime.
     */
    public utc(): any {
        const ctor = this.constructor as typeof DateTime;
        const date = ctor.DEFAULT_CLASS_NAME.utc();
        return this.newDate(date);
    }

    /**
     * Get now DateTime for given timezone.
     */
    public now($tz: any = null): any {
        const ctor = this.constructor as typeof DateTime;
        let date = ctor.DEFAULT_CLASS_NAME.utc().setZone(ctor.getTimeZone());
        if ($tz) {
            date = date.setZone($tz);
        }
        return this.newDate(date);
    }

    /**
     * Add date diff.
     */
    public add(date: any): any {
        let diff: any = {};
        if (date instanceof (this.constructor as any)) {
            diff = date.DATE_TIME.diff(this.DATE_TIME);
        }
        if (date instanceof LuxonDateTime) {
            diff = date.diff(this.DATE_TIME);
        }
        return this.plus(diff.milliseconds);
    }

    /**
     * Plus interval.
     */
    public plus(obj: any): any {
        const date = this.clone(this.DATE_TIME);
        return this.newDate(date.plus(obj));
    }

    public addSeconds(value: any): any {
        return this.plus({ seconds: value });
    }

    public addMinutes(value: any): any {
        return this.plus({ minutes: value });
    }

    public addHours(value: any): any {
        return this.plus({ hours: value });
    }

    public addDays(value: any): any {
        return this.plus({ days: value });
    }

    public addWeeks(value: any): any {
        return this.plus({ weeks: value });
    }

    public addYears(value: any): any {
        return this.plus({ years: value });
    }

    public format(format: any): string {
        return this.DATE_TIME.toFormat(format).toString();
    }

    public getTimestamp(): number {
        return this.DATE_TIME.ts;
    }

    public static use($handler: any): any {
        if (is_callable($handler)) {
            return this.useCallable($handler);
        } else if (is_string($handler)) {
            return this.useClass($handler);
        }
        throw new InvalidArgumentException('Invalid date creation handler. Please provide a class name, callable, or Carbon factory.');
    }

    public static useDefault(): void {
        this.$callable = null;
        this.$factory = null;
        this.$dateClass = null;
    }

    public static useCallable($callable: any): void {
        this.$callable = $callable;
        this.$factory = null;
        this.$dateClass = null;
    }

    public static useClass($dateClass: any): void {
        this.$dateClass = $dateClass;
        this.$factory = null;
        this.$callable = null;
    }

    public static useFactory($factory: any): void {
        this.$factory = $factory;
        this.$callable = null;
        this.$dateClass = null;
    }

    public clone(date: any): any {
        const ctor = this.constructor as typeof DateTime;
        return new ctor.DEFAULT_CLASS_NAME(date);
    }

    public newDate(date: any): any {
        const ctor = this.constructor as any;
        return new ctor(date);
    }

    public toString(): string {
        return this.DATE_TIME.toFormat('yyyy-MM-dd HH:mm:ss');
    }
}

export default DateTime;
