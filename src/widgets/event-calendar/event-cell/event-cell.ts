import Vue from 'vue';
import EventBox from '../event-box/event-box.vue';

export default Vue.extend({

    props: [ 'emptyCell', 'addOnHover', 'day', 'hour', 'hourname', 'direction' ],

    components: {EventBox},

    methods: {
  
        handleEmptyCell() {
            if (this.emptyCell) {
                this.emptyCell();
                return;
            }
            if (this.addOnHover) {
                this.addOnHover();
            }
        }
    }

})