import DateTime from '../src/dateTime';
import { DateTime as LuxonDateTime } from 'luxon';
import InvalidArgumentException from '../src/exceptions/invalidArgumentException';

describe('DateTime', () => {
    afterEach(() => {
        DateTime.useDefault();
    });

    test('constructor and getters/setters', () => {
        const dt1 = new DateTime();
        expect(dt1.DATE_TIME).toBeDefined();

        const customLuxon = LuxonDateTime.utc(2023, 1, 1, 12, 0, 0);
        const dt2 = new DateTime(customLuxon);
        expect(dt2.DATE_TIME.year).toBe(2023);

        const dt3 = new DateTime(dt2);
        expect(dt3.DATE_TIME.year).toBe(2023);

        const nativeDate = new Date('2024-05-10T10:00:00.000Z');
        const dt4 = new DateTime(nativeDate);
        expect(dt4.DATE_TIME.year).toBe(2024);

        dt1.DATE_TIME = customLuxon;
        expect(dt1.DATE_TIME.year).toBe(2023);
    });

    test('static now and timezone', () => {
        const prevTz = process.env.TZ;
        process.env.TZ = 'UTC';
        expect(DateTime.getTimeZone()).toBe('UTC');

        const now = DateTime.now();
        expect(now).toBeInstanceOf(DateTime);

        const nowInZone = (new DateTime()).now('America/New_York');
        expect(nowInZone.DATE_TIME.zoneName).toBe('America/New_York');

        process.env.TZ = prevTz;
    });

    test('create, createFromDate, createFromFormat, createFromTime', () => {
        const dt = new DateTime();
        const created = dt.create(2025, 6, 15, 10, 30, 45, 'UTC');
        expect(created.year).toBe(2025);
        expect(created.month).toBe(6);
        expect(created.day).toBe(15);

        const fromDate = dt.createFromDate(2025, 7, 20, 'UTC');
        expect(fromDate.year).toBe(2025);
        expect(fromDate.month).toBe(7);
        expect(fromDate.day).toBe(20);

        const fromFmt = dt.createFromFormat('yyyy-MM-dd', '2025-12-25', 'UTC');
        expect(fromFmt.year).toBe(2025);
        expect(fromFmt.month).toBe(12);
        expect(fromFmt.day).toBe(25);

        const fromTime = dt.createFromTime(14, 20, 30, 'UTC');
        expect(fromTime.hour).toBe(14);
        expect(fromTime.minute).toBe(20);
        expect(fromTime.second).toBe(30);

        // default args branches
        const createdNoArgs = dt.create();
        expect(createdNoArgs).toBeDefined();
        const fromDateNoArgs = dt.createFromDate();
        expect(fromDateNoArgs).toBeDefined();
        const fromTimeNoArgs = dt.createFromTime();
        expect(fromTimeNoArgs).toBeDefined();

        const createdDefTz = dt.create(2025, 6, 15, 10, 30, 45);
        expect(createdDefTz).toBeDefined();
        const fromDateDefTz = dt.createFromDate(2025, 7, 20);
        expect(fromDateDefTz).toBeDefined();
        const fromFmtDefTz = dt.createFromFormat('yyyy-MM-dd', '2025-12-25');
        expect(fromFmtDefTz).toBeDefined();
        const fromTimeDefTz = dt.createFromTime(14, 20, 30);
        expect(fromTimeDefTz).toBeDefined();
    });

    test('utc, getTime, toString, format, getTimestamp', () => {
        const dt = new DateTime(LuxonDateTime.utc(2025, 1, 1, 12, 0, 0));
        expect(dt.format('yyyy')).toBe('2025');
        expect(dt.toString()).toBe('2025-01-01 12:00:00');
        expect(dt.getTime()).toBe('2025-01-01 12:00:00');
        expect(typeof dt.getTimestamp()).toBe('number');

        const u = dt.utc();
        expect(u).toBeInstanceOf(DateTime);
    });

    test('add methods (addSeconds, addMinutes, addHours, addDays, addWeeks, addYears, add with DateTime / Luxon)', () => {
        const dt = new DateTime(LuxonDateTime.utc(2025, 1, 1, 0, 0, 0));
        expect(dt.addSeconds(10).DATE_TIME.second).toBe(10);
        expect(dt.addMinutes(5).DATE_TIME.minute).toBe(5);
        expect(dt.addHours(2).DATE_TIME.hour).toBe(2);
        expect(dt.addDays(3).DATE_TIME.day).toBe(4);
        expect(dt.addWeeks(1).DATE_TIME.day).toBe(8);
        expect(dt.addYears(1).DATE_TIME.year).toBe(2026);

        const futureDt = new DateTime(LuxonDateTime.utc(2025, 1, 1, 0, 0, 15));
        const addedDt = dt.add(futureDt);
        expect(addedDt.DATE_TIME.second).toBe(15);

        const futureLuxon = LuxonDateTime.utc(2025, 1, 1, 0, 0, 25);
        const addedLuxon = dt.add(futureLuxon);
        expect(addedLuxon.DATE_TIME.second).toBe(25);
    });

    test('use, useDefault, useCallable, useClass, useFactory', () => {
        const callable = function () {};
        DateTime.use(callable);
        expect(DateTime.$callable).toBe(callable);
        expect(DateTime.$dateClass).toBeNull();
        expect(DateTime.$factory).toBeNull();

        DateTime.use('CustomClass');
        expect(DateTime.$dateClass).toBe('CustomClass');
        expect(DateTime.$callable).toBeNull();

        const factoryObj = {};
        DateTime.useFactory(factoryObj);
        expect(DateTime.$factory).toBe(factoryObj);
        expect(DateTime.$callable).toBeNull();
        expect(DateTime.$dateClass).toBeNull();

        expect(() => {
            DateTime.use(12345);
        }).toThrow(InvalidArgumentException);

        DateTime.useDefault();
        expect(DateTime.$callable).toBeNull();
        expect(DateTime.$factory).toBeNull();
        expect(DateTime.$dateClass).toBeNull();
    });
});
