import Vue from 'vue';

export default Vue.extend({

    props: ['color'],

    data() {
        const data : {
            open: boolean
        } = {
            open: false
        }

        return data;
    },

    methods: {
        getColor() {
            if (this.color) return this.color;
            return 'black';
        },

        toggle() {
            this.open = !this.open;

            this.$emit('change', this.open);
            this.$emit('input', this.open);
        }
    }
});