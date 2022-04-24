import Vue from 'vue';

export default Vue.extend({

    props: [ 'value' ],

    methods: {
        onclick() {
            this.$emit('input', !this.value);
            this.$emit('change', !this.value);
        }
    }

})