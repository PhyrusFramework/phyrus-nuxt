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
                this.$emit('change', true);
            } else {
                this.status = 'closed';
                this.$emit('change', false);
            }

        },

        close() {
            this.status = 'closed';
            this.$emit('change', false);
        }
    }

});