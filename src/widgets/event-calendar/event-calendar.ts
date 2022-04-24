
import Vue from 'vue';
import Utils from '../../modules/utils';
import Time from '../../modules/time';
import EventCell from './event-cell/event-cell.vue';
import EventBox from './event-box/event-box.vue';

export default Vue.extend({

    props: ['mode', 'events', 'starthour', 'endhour', 'addOnHover', 'emptyCell'],

    components: { EventCell, EventBox },

    data() {
        const data : {
            currentDay: Time,
            _monthDays: any,
            _weekDays: any,
            _day: any
        } = {
            currentDay: new Time(),
            _monthDays: null,
            _weekDays: null,
            _day: null
        }

        return data;
    },

    methods: {

        getMonthDays() {
            if (this._monthDays) return this._monthDays;

            const first = this.currentDay.getFirstOfMonth().getMonday();
            const last = this.currentDay.getLastOfMonth().getSunday().add(1);

            const list: any = {}

            const thisMonth = this.currentDay.format('MM');

            while(last.isAfter(first)) {

                const item : any = {
                    same: first.format('MM') == thisMonth,
                    dayNumber: first.format('DD'),
                    events: []
                };

                list[first.format('YYYY-MM-DD')] = item;
                first.add(1);

            }

            const evs = this.events.map((item: any) => {

                const it : any = Utils.force(item, {
                    text: '',
                    date: '',
                    color: 'green',
                    meet: null,
                    link: null,
                    onClick: null,
                    popup: null,
                    popupVisible: 0
                });

                it.date = new Time(it.date);

                return it;
            });

            for(let ev of evs) {

                let id = ev.date.format('YYYY-MM-DD');
                if (!list[id]) {
                    continue;
                }

                list[id].events.push(ev)
            }

            this._monthDays = list;
            return list;
        },

        getWeekDays() {
            if (this._weekDays) return this._weekDays;

            const first = this.currentDay.getMonday();
            const list : any = {};

            for(let i = 0; i < 7; ++i) {
                const item : any = {
                    time: null,
                    hours: {}
                }
                if (i == 0) 
                    item.time = first;
                else 
                    item.time = first.copy().add(i);

                for(let j = 0; j < 24; ++j) {
                    let str = "" + j;
                    if (str.length < 2)
                        str = "0" + str;

                    item.hours["d" + str] = {
                        number: str,
                        events: []
                    }
                }

                list[item.time.format('MM/DD')] = item;
            }

            // Place events
            if (!this.events || this.events.length == 0) {
                this._weekDays = list;
                return list;
            }

            const evs = this.events.map((item: any) => {

                const it : any = Utils.force(item, {
                    text: '',
                    date: '',
                    color: 'green',
                    meet: null,
                    link: null,
                    onClick: null,
                    popup: null,
                    popupVisible: 0
                });

                it.date = new Time(it.date);

                return it;
            });

            for(let ev of evs) {

                let id = ev.date.format('MM/DD');
                if (!list[id]) {
                    continue;
                }

                let hour = ev.date.format('HH');
                if (!list[id].hours["d" + hour]) {
                    continue;
                }

                list[id].hours["d" + hour].events.push(ev);
            }

            Object.keys(list)
            .forEach(id => {

                Object.keys(list[id].hours)
                .forEach(hour => {

                    let evs : any[] = list[id].hours[hour].events;
                    if (!evs) return;

                    evs.sort((a: any, b: any) => {
                        if (a.date.datetime() < b.date.datetime()) {
                            return -1;
                        }
                        return 1;
                    });

                })

            });

            this._weekDays = list;
            return list;
        },

        firstDay() {
            const keys = Object.keys(this._weekDays);
            return keys.length > 0 ? this._weekDays[keys[0]] : null;
        },

        getDay(monthDay : string | null = null) {
            if (this._day) return this._day;

            const md = this.currentDay.format('MM/DD');

            const list = this.getWeekDays();
            if (!list[md]) return null;

            this._day = list[md];
            return this._day;
        },

        dayTitle() {
            return Utils.capitalize(this.currentDay.format('dddd, DD')) + ' ' + Utils.capitalize(this.currentDay.format('MMMM'));
        },

        monthTitle() {
            return Utils.capitalize(this.currentDay.format('MMMM'));
        },

        daynames() {
            const monday = this.currentDay.getMonday();
            const daynames : string[] = [];

            for(let i = 0; i < 7; ++i) {
                daynames.push(Utils.capitalize(monday.format('dddd')));
                monday.add(1);
            }

            return daynames;
        },

        getDisplayHours() {
            let result: any = {}
            const hours = this.firstDay().hours;
            const keys = Object.keys(hours);

            const starth = this.starthour ? this.starthour : 0;
            const endh = this.endhour ? this.endhour : 24;

            for(let k of keys) {
                let hour = hours[k];

                if (Number(hour.number) >= starth
                && Number(hour.number) < endh) {
                    result[k] = hours[k];
                }
            }

            return result;
        },

        reset() {
            this._day = null;
            this._weekDays = null;
            this._monthDays = null;
            this.$forceUpdate();
        },

        next() {
            if (this.mode == 'day') {
                this.currentDay.add(1);
            } else if (this.mode == 'month') {
                this.currentDay.add(
                    this.currentDay.daysThisMonth - Number(this.currentDay.get('day')) + 1
                );
            } else { // week
                this.currentDay.add(7);
            }
            this.reset();
        },

        previous() {
            if (this.mode == 'day') {
                this.currentDay.add(-1);
            }  else if (this.mode == 'month') {
                this.currentDay.add(
                    -Number(this.currentDay.daysThisMonth)
                );
            } else { // week
                this.currentDay.add(-7);
            }
            this.reset();
        }
    }

})