import Moment from 'moment-timezone';
import timezone from 'countries-and-timezones';
import Config from './config';
import Utils from './utils';

export default class Time {

    _moment: Moment.Moment;

    static instance(item?: any, format?: string, correctTimezone?: boolean) {
        return new Time(item, format, correctTimezone);
    }

    constructor(item?: any, format?: string, correctTimezone?: boolean) {

        var userLang = Config.defaultLanguage;
        Moment.locale(userLang);

        let it = item;
        if (!it) {
            var now = new Date();
            var date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+ now.getDate();
            var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
            it = date+' '+time;
        }

        let f = format;
        if (!f) {
            if (it.includes('Z')) {
                f = "YYYY-MM-DDTHH:mm:ssZ";
            } else if (it.includes(':')) {
                f = 'YYYY-MM-DD HH:mm:ss';
            } else {
                f = 'YYYY-MM-DD';
            }
        }

        this._moment = Moment(it, f);
        if (correctTimezone) {
            let tz = timezone.getTimezone(Moment.tz.guess());
            if (tz) {
                this._moment = this._moment.add(tz.dstOffset / 60, 'hours');
            }
        }

    }

    utc() {
        return this.format('YYYY-MM-DDTHH:mm:ssZ');;
    }
    
    gmt() {
        const displace = this._moment.utcOffset();
        const t = this.copy().add(-displace, 'minutes');
        let str = t.format('YYYY-MM-DDTHH:mm:ss');
        str += 'Z';
        return str;
    }

    dateObject() {
        return this._moment.toDate();
    }

    format(format: string) {
        return this._moment.format(format);
    }

    dateString() {
        return this._moment.format("dddd DD MMM - HH:mm");
    }

    date() {
        return this._moment.format("DD/MM/YYYY");
    }

    timestamp() {
        return parseInt(this._moment.format("X"));
    }

    datetime() {
        return this._moment.format("YYYY-MM-DD HH:mm:ss");
    }

    time() {
        return this._moment.format("HH:mm");
    }

    dateAndTime() {
        return this._moment.format("DD/MM/YYYY HH:mm");
    }

    calendar() {
        return this._moment.format("ddd D MMMM YYYY");
    }

    ago() {
        return Moment.duration( Moment(new Date()).diff(this._moment) ).asSeconds()
    }

    get daysThisMonth() : number {
        return Number(this._moment.daysInMonth());
    }

    get(what: string, asString: boolean = false) : Number | string {
        let f = "YYYY";
        if (what == "second") f = "ss";
        else if (what == "minute") f = "mm";
        else if (what == "hour") f = "HH";
        else if (what == "day") f = "DD";
        else if (what == "month") f = "MM";
        let val: any = Number(this._moment.format(f));
        if (asString) val += "";
        return val;
    }

    static timeToDate(value: string) {
        let d : any = new Date();
        let parts = value.split(":");
        d.setHours = parseInt(parts[0]);
        d.setMinutes = parseInt(parts[1]);
        return d;
    }

    add(amount: number, unit: 
        'second'|'seconds'|
        'minute'|'minutes'|
        'hour'|'hours'|
        'day'|'days' = 'days') {

        let u : string = unit;
        if (u[u.length - 1] != 's') {
            u += 's';
        }

        this._moment.add(amount, u as any);
        return this;
    }

    sub(days: number) {
        return this.add(-days);
    }

    secondsPassed(time?: Time) {
        var duration = Moment.duration((time ? time : Time.now())._moment.diff(this._moment));
        return duration.asSeconds();
    }

    dayOfWeek() {
        let d = this.dateObject().getDay();
        d -= 1;
        if (d < 0) d = 6;
        return d;
    }

    dayOfMonth() {
        return this.dateObject().getDate();
    }

    dayName() {
        return Utils.capitalize(this.format('dddd'));
    }

    getMonday() {
        let d : Date = this._moment.toDate();
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        d = new Date(d.setDate(diff));

        const str = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        return new Time(str);
    }

    getSunday() {
        let d : Date = this._moment.toDate();
        var day = d.getDay(),
            diff = d.getDate() + (6 - day) + (day == 0 ? -6:1); // adjust when day is sunday
        d = new Date(d.setDate(diff));

        const str = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        return new Time(str);
    }

    getFirstOfMonth() {
        return Time.instance(this.format('YYYY-MM-01 HH:mm:ss'));
    }

    getLastOfMonth() {
        return Time.instance(this.format('YYYY-MM-' + this.daysThisMonth + ' HH:mm:ss'));
    }

    static now() {
        return new Time();
    }

    static todayAt(hour: number, minute?: number) {
        let d = new Date();
        d.setHours(hour, minute);
        return Time.fromDate(d);
    }

    static fromDate(d: Date) {

        ///// FORMAT DATE AS STRING

        let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        let str = [year, month, day].join('-');

        //////////
        return new Time(str, "YYYY-MM-DD");
    }

    static fromTimestamp(t: number) {
        return new Time(t, "X");
    }

    copy() {
        return new Time(this.datetime());
    }

    isAfter(other: Time) {
        return this._moment.isAfter(other._moment);
    }

    isPast() {
        return !this.isAfter(Time.now());
    }

    diff(t2: Time|string) : TimeInterval {
        let t : Time = typeof(t2) == 'string' ? new Time(t2) : t2;
        return new TimeInterval(t, this);
    }
}

export class TimeInterval {

    t1: Time;
    t2: Time;

    constructor(t1: Time, t2: Time) {
        this.t1 = t1;
        this.t2 = t2;
    }

    static instance(t1: Time, t2: Time) {
        return new TimeInterval(t1, t2);
    }

    get seconds() {
        return this.t1._moment.diff(this.t2._moment, 'seconds');
    }

    get minutes() {
        return this.t1._moment.diff(this.t2._moment, 'minutes');
    }

    get hours() {
        return this.t1._moment.diff(this.t2._moment, 'hours');
    }

    get days() {
        return this.t1._moment.diff(this.t2._moment, 'days');
    }

    get months() {
        return this.t1._moment.diff(this.t2._moment, 'months');
    }

    get years() {
        return this.t1._moment.diff(this.t2._moment, 'years');
    }

    get all() {

        const y = this.years;
        const m = this.months - (y*12);
        let d = this.days - (m * 30);
        let h = this.hours - Math.floor(d * 24);
        let min = this.minutes - Math.floor(h * 60);
        let s = this.seconds - Math.floor(min * 60);

        return {
            years: y,
            month: m,
            days: d,
            hours: h,
            minutes: min,
            seconds: s
        }
    }

}