
import Vue from 'vue';
import Loader from '../loader/loader.vue';

export default Vue.extend({

    components: { Loader },

    props: [ 'iconleft', 
    'iconright', 
    'onClick', 
    'loading', 
    'disabled', 
    'content' ],

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

        isDisabled(update: boolean = false) {
            if (update) {
                setTimeout(() => {
                    this.$forceUpdate();
                }, 10);
            }

            if (this.disabled === undefined) return false;
            if (this.disabled === false) return true;
            if (this.disabled === true) return false;
            return this.disabled();
        },

        clickAction() {

            if (this.isDisabled()) {
                return;
            }

            if (this.onClick) {
                this.onClick();
            }

            this.$emit('click');
        }

    }

})