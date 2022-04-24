import Vue from 'vue';
import App from '../../modules/app';

export default Vue.extend({

    props: ['text', 'icon', 'cancelable', 'buttonLeft', 'buttonRight'],

    data: function() {

        return {
        };
    },

    methods: {
        close() {
            App.modal.close();
        },
        clickButton(btn: any) {
            btn.onClick();
            this.close();
        }
    }

})