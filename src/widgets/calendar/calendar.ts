import Vue from 'vue';
import Time from '../../modules/time';

export default Vue.extend({

    props: ['value', 'onChange', 'disabled'],

    data: function() {

        let data : {
            currentMonth: Time|null,
            table: any[][]|null,
            selected: any
        } = {
            currentMonth: null,
            table: null,
            selected: null
        };

        return data;
    },

    created() {
        let now = this.value ? (new Time(this.value)) : Time.now();
        this.currentMonth = now.sub(now.dayOfMonth() - 1);
        this.refreshTable(this.disabled ? false : true);
    },

    methods: {

        title() {
            if (!this.currentMonth) return '';

            let t = this.currentMonth.format('MMMM YYYY');
            return t[0].toUpperCase() + t.substr(1);
        },

        select(day: {full: string, enabled: boolean}) {
            if (this.disabled) return;
            if (!day.enabled) return;

            let prev = this.selected;
            this.selected = day.full;
            this.$emit('input', this.selected);

            if (this.onChange) {
                let result = this.onChange(this.selected, this);

                if (result === false) {
                    this.selected = prev;
                    this.$emit('input', this.selected);
                    return;
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
    
            for(let i = 0; i < rows; ++i) {
    
                let row : any[] = [];
    
                for(let j = 0; j < 7; ++j) {

                    let item = {
                        full: first.datetime(),
                        number: first.get('day'),
                        enabled: thisMonth == first.get('month')
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
            this.selected = null;
            this.$emit('input', null);
        },

        isToday(date: string) {
            let day = Time.instance(date).date();
            let today = Time.now().date();
            return day == today;
        }
    }

})