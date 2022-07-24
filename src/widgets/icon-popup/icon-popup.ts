import Vue from 'vue';

export default Vue.extend({

    props: ['icon', 'badge', 'content', 'component', 'props', 'side', 'closeOnTouch'],

    data() {
        let data : {
            open: boolean,
            opacity: number,
            manual: boolean
        } = {
            open: false,
            opacity: 0,
            manual: false
        }

        return data;
    },

    created() {
        if (this.closeOnTouch !== false) {
            document.body.addEventListener('click', () => {
                setTimeout(() => {
                    this.close();
                }, 10);
            }, true); 
        }
    },

    methods: {

        close() {
            if (this.manual) return;
            if (!this.open) return;
            this.toggle();
        },

        preventClose() {
            this.manual = true;

            setTimeout(() => {
                this.manual = false;
            }, 20);
        },

        toggle() {

            this.open = !this.open;
            
            this.preventClose();

            if (this.open) this.opacity = 1;
            else {
                setTimeout(() => {
                    this.opacity = 0;
                }, 300);
            }

        },

        getProps() {
            let props = this.props ? this.props : {}

            return {
                ...props,
                popup: this
            }
        }

    }

});