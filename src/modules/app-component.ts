import Vue from 'vue';
import translate from './translator';
import Utils from './utils';
import Time from './time';
import Storage from './storage';
import Config from './config';
import App from './app';

let AppComponent = Vue.extend({

    data() {
        return {
            lib: {
                utils: Utils,
                time: Time,
                storage: Storage,
                config: Config.get()
            }
        }
    },

    methods: {
        $t(key: string, params?: any) {
            return translate.get(key, params);
        },

        hasEvent(name: string) {
            return this.$listeners[name];
        },

        to(page: string) {
            this.$router.push(page);
        },

        back() {
            this.$router.back();
        },

        ref(name: string) : any {
            return this.$refs[name] as any;
        },

        closeModal() {
            return App.modal.close();
        },

        copyToClipboard(content: string) {
            navigator.clipboard.writeText(content);
        }
    }

});
export default AppComponent;