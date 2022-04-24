import Vue from 'vue';

export default Vue.extend({

    props: ['label', 'open'],

    data() {
        let data : {
            status: 'closed'|'expanding'|'expanded'
        } = {
            status: 'closed'
        };
        return data;
    },

    created() {
        if (this.open) {
            this.status = 'expanded';
        }
    },

    methods: {
        toggle() {

            /**
             * El tema de la animación de momento se ha dejado
             * porque no quedaba muy bien.
             */

            if (this.status == 'closed') {
                this.status = 'expanded';
            } else {
                this.status = 'closed';
            }

        },

        close() {
            this.status = 'closed';
        }
    }

});