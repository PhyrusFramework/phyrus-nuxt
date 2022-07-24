import Vue from 'vue';
import Time from '../../modules/time';

export default Vue.extend({

    props: ['value', 'onChange', 'disabled', 'range'],

    data: function() {

        let data : {
            currentMonth: Time|null,
            table: any[][]|null,
            selected: any,
            rangeTimes: (Time|null)[],
            hovered: Time|null
        } = {
            currentMonth: null,
            table: null,
            selected: null,
            rangeTimes: [null, null],
            hovered: null
        };

        return data;
    },

    created() {
        let now = Time.now();
        if (!this.range) {
            now = this.value ? (new Time(this.value)) : Time.now();
        } else {
            now = this.value ? (new Time(this.value[0])) : Time.now();
        }
        this.currentMonth = now.sub(now.dayOfMonth() - 1);
        this.refreshTable(this.disabled ? false : true);
    },

    methods: {

        title() {
            if (!this.currentMonth) return '';

            let t = this.currentMonth.format('MMMM YYYY');
            return t[0].toUpperCase() + t.substr(1);
        },

        emit(value: any) {

            let prev = this.selected;
            this.selected = value;

            this.$emit('input', this.selected);
            this.$emit('change', this.selected);

            if (!value) return;

            if (this.onChange) {
                let result = this.onChange(this.selected, this);

                if (result === false) {
                    this.selected = prev;
                    this.$emit('input', this.selected);
                    this.$emit('change', this.selected);
                    return;
                }
            }
        },

        select(day: {full: string, enabled: any}) {
            if (this.disabled) return;
            if (!day.enabled(true)) return;

            if (!this.range) {
                this.emit(day.full);
            } else {
                if (!this.selected) {
                    this.selected = [day.full, null];
                    this.rangeTimes[0] = Time.instance(day.full);
                } else {
                    if (day.full == this.selected[0]) {
                        this.selected = null;
                        this.rangeTimes = [null, null];
                    } else if (this.selected[1] == day.full) {
                        this.selected = [this.selected[0], null];
                        this.rangeTimes = [this.rangeTimes[0], null];
                    } else {
                        let val = [this.selected[0], day.full];
                        this.rangeTimes[1] = Time.instance(day.full);
                        this.emit(val);
                    }
                }
            }
        },

        prevMonth() {
            this.currentMonth?.sub(5);
            let day = this.currentMonth?.dayOfMonth();
            if (day! > 1) {
                this.currentMonth?.sub(day! - 1);
            }

            this.refreshTable();
        },

        nextMonth() {
            this.currentMonth?.add(32);
            let day = this.currentMonth?.dayOfMonth();
            if (day! > 1) {
                this.currentMonth?.sub(day! - 1);
            }

            this.refreshTable();
        },

        refreshTable(setInitial = false) {
            let now : Time = this.currentMonth!;
            let thisMonth = now.get('month');

            let first = this.currentMonth?.copy()!;
            let dow = first.dayOfWeek();
    
            let rows = 6;
            if (dow > 0) {
                first.sub(dow);
            } else {
                rows = 5;
            }
    
            this.table = [];

            const ref = this;
    
            for(let i = 0; i < rows; ++i) {
    
                let row : any[] = [];
    
                for(let j = 0; j < 7; ++j) {

                    let item = {
                        full: first.datetime(),
                        month: first.get('month'),
                        number: first.get('day'),
                        enabled(forClick: boolean = false) {
                            if (!forClick || !ref.range || !ref.selected) {
                                return this.month == ref.currentMonth!.get('month');
                            }
                            return true;
                        }
                    };

                    if (setInitial && item.full == this.value) {
                        this.selected = item.full;
                    }
    
                    row.push(item);
                    first.add(1);
                }
    
                this.table.push(row);
    
            }
        },

        clear() {
            this.emit(null);
        },

        isToday(date: string) {
            let day = Time.instance(date).date();
            let today = Time.now().date();
            return day == today;
        },

        setHovered(day: any) {
            if (!day) {
                this.hovered = null;
                return;
            }
            this.hovered = Time.instance(day.full);
        },

        classForCell(day: any) {
            const obj : any = {
                disabled: !day.enabled(),
                today: this.isToday(day.full)
            }

            if (!this.range) {
                obj['active'] = this.selected == day.full;
            } else {
                obj['active'] = this.selected ? 
                (this.selected[0] == day.full || 
                (this.selected[1] && this.selected[1] == day.full)) : false;

                if (!obj['active'] && this.selected) {

                    let t = Time.instance(day.full);
                    if (this.selected[1]) {

                        if (this.rangeTimes[1]?.isAfter(this.rangeTimes[0]!)) {
                            obj['inrange'] = t.isAfter(this.rangeTimes[0]!)
                            && this.rangeTimes[1]!.isAfter(t);
                        } else {
                            obj['inrange'] = t.isAfter(this.rangeTimes[1]!)
                            && this.rangeTimes[0]!.isAfter(t);
                        }

                    } else if (this.hovered) {
                        if(this.hovered.isAfter(this.rangeTimes[0]!)) {
                            obj['inrange'] = t.isAfter(this.rangeTimes[0]!)
                            && this.hovered!.isAfter(t);
                        } else {
                            obj['inrange'] = t.isAfter(this.hovered!)
                            && this.rangeTimes[0]!.isAfter(t);
                        }
                    }

                }            
            }

            return obj;
        }
    }

})