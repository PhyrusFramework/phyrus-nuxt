
import Vue from 'vue';
import Loader from '../loader/loader.vue';

export default Vue.extend({

    components: { Loader },

    props: [ 'iconleft', 'iconright', 'onClick', 'loading', 'disabled', 'content' ],

    data() { 

        let data : {
            lefticon: {name: string, source: string|null}|null,
            righticon: {name: string, source: string|null}|null
        } = {
            lefticon: null,
            righticon: null
        }

        return data
    },

    created() {
        if (this.iconleft) {
            if (typeof this.iconleft == 'string') {
                this.lefticon = {
                    name: this.iconleft,
                    source: null
                };
            } else {
                this.lefticon = this.iconleft;
            }
        }

        if (this.iconright) {
            if (typeof this.iconright == 'string') {
                this.righticon = {
                    name: this.iconright,
                    source: null
                };
            } else {
                this.righticon = this.iconright;
            }
        }
    },

    methods: {

        clickAction() {

            if (this.disabled) {
                return;
            }

            if (this.onClick) {
                this.onClick();
            }

            this.$emit('click');
        }

    }

})