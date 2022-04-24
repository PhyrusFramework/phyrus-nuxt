import Vue from 'vue';

export default Vue.extend({

    props: ['src', 'height', 'width', 'placeholder'],

    data() {
        let data : {
            loaded: boolean,
            error: boolean
        } = {
            loaded: false,
            error: false
        }

        return data;
    },

    created() {
        if (!this.src) {
            this.imgError();
        }
    },

    methods: {
        imgError() {
            this.loaded = true;
            this.error = true;
        }
    }

});