import Vue from 'vue';
import App from '../../modules/app';

export default Vue.extend({

    props: ['text', 'icon', 'cancelable', 'buttonLeft', 'buttonRight', 'onPressX'],

    methods: {
        close() {
            if (this.onPressX) {
                this.onPressX();
            }

            App.modal.close();
        },
        clickButton(btn: any) {
            btn.onClick();
            this.close();
        }
    }

})