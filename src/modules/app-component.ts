import Vue from 'vue';
import translate from './translator';
import Utils from './utils';
import Time from './time';
import Storage from './storage';
import Config from './config';
import App from './app';
import store from './store';

let cmp = Vue.extend({

    data() {
        return {
            phyrus: {
                utils: Utils,
                time: Time,
                storage: Storage,
                config: Config.get(),
                store: store
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
            return (this.$refs as any)[name];
        },

        closeModal() {
            return App.modal.close();
        },

        copyToClipboard(content: string) {
            navigator.clipboard.writeText(content);
        },

        middlewareCompleted() {
            return store.middlewareStatus;
        }
    }

});

type VueType = typeof cmp;

const AppComponent = () : VueType => {
    return cmp.extend({
        middleware: Config.defaultMiddleware,
        layout: Config.defaultLayout
    });
}

export default AppComponent;