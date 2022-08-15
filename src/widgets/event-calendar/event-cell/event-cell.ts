import Vue from 'vue';
import Time from '../../../modules/time';
import EventBox from '../event-box/event-box.vue';

export default Vue.extend({

    props: [ 'emptyCell', 
    'addOnHover', 
    'day', 
    'hour', 
    'hourname', 
    'direction', 
    'time', 
    'mode', 
    'displayInterval', 
    'bulletEvents', 
    'positionEvents',
    'addIconBelow'],

    components: {EventBox},

    methods: {

        getTime() {
            return new Time(
                this.day.time.format('YYYY-MM-DD') + ' ' + this.hour.number + ':00:00'
            );
        },
  
        handleEmptyCell(day: any) {
            if (this.emptyCell) {
                this.emptyCell(this.getTime());
                return;
            }
            if (this.addOnHover) {
                this.addOnHover(this.getTime());
            }
        },

        getEvents(day: any) {
            if (!this.mode || this.mode != 'month')
                return day.hours[this.hourname].events;
            else
                return day.events;
        }
    }

})