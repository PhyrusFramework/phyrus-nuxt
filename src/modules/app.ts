import Alert from '../modals/alert/alert.vue';
import { AppModalInterface } from '../widgets/app-modal/app-modal';
import { AppNotificationsInterface } from '../widgets/app-notifications/app-notifications';
import { DrawerButton, DrawerInterface } from '../widgets/drawer/drawer';
import { ZoomImageInterface } from '../widgets/zoom-image/zoom-image';
import translate from './translator';
import Cropper from '../modals/cropper/cropper.vue';
import ModelSelect from '../modals/model-select/model-select.vue';
import ScreenLoader from '../modals/screen-loader/screen-loader.vue';

export default class App {

    static drawer : DrawerInterface = {

        _ref: null,
        setReference(ref: any) {
            this._ref = ref;
        },

        setTitle(title: string) {
            if (!this._ref) return App.drawer;

            this._ref.title = title;
            return App.drawer;
        },

        setButtonLeft(button: DrawerButton) {
            if (!this._ref) return App.drawer;

            this._ref.buttonLeft = button;
            return App.drawer;
        },

        setButtonRight(button: DrawerButton) {
            if (!this._ref) return App.drawer;

            this._ref.buttonRight = button;
            return App.drawer;
        },

        onClose(func: () => any) {
            if (!this._ref) return App.drawer;

            this._ref.onClose = func;
            return App.drawer;
        },

        open(options: {
            component: any,
            props?: any,
            title?: string,
            buttonLeft?: {
                text: string,
                onClick?: (ref: any) => void,
                icon?: string
            },
            buttonRight?: {
                text: string,
                onClick?: (ref: any) => void,
                icon?: string
            }
        }) {
            if (!this._ref) return;

            this._ref.open(options);
            return App.drawer;
        },

        close() {
            if (!this._ref) {
                return new Promise((resolve,reject) => {});
            }

            return this._ref.close();
        }

    };

    static notifications : AppNotificationsInterface = {

        _ref: null,
        setReference(ref: any) {
            this._ref = ref;
        },

        add(type : 'error'|'success'|'warning'|'info', message: string) {
            if (!this._ref) {
                return;
            }

            this._ref.add(type, message);
        },

        addCustom(component: any, props : any = {}) {
            if (!this._ref) {
                return;
            }
            this._ref.addCustom(component, props);
        },

        closeNotification(notification: any) {
            if (!this._ref) return;

            this._ref.closeNotification(notification);
        },

        closeLast() {
            if (!this._ref) return;

            this._ref.closeLast();
        },
        closeFirst() {
            if (!this._ref) return;

            this._ref.closeFirst();
        }

    }

    static modal : AppModalInterface = {

        _ref: null,
        setReference(ref: any) {
            this._ref = ref;
        },

        modals: [],
    
        open(options: {
            component: any, 
            props?: any, 
            cancelable?: boolean,
            width?: string,
            class?: string
        }) {
            if (!this._ref) {
                return;
            }

            this._ref.open(options);
        },
    
        close() {
            if (!this._ref) {
                return new Promise((resolve, reject) => {});
            }

            return this._ref.close();
        }

    }

    static zoomedImage : ZoomImageInterface = {
        _ref: null,
        setReference(ref: any) {
            this._ref = ref;
        },

        open(url: string) {
            if (!this._ref) {
                return;
            }
            this._ref.open(url);
        },

        close() {
            if (!this._ref) return;
            this._ref.close();
        }
    }

    static displayAlert(props: {
        text: string,
        cancelable?: boolean,
        icon?: string,
        buttonLeft?: {text: string, onClick: () => void},
        buttonRight?: {text: string, onClick: () => void}
    }) {
        App.modal!.open({
            component: Alert,
            cancelable: props.cancelable,
            props: props
        });
    }

    static confirmation(text: string, icon: string = 'exclamation') : Promise<any> {

        return new Promise((resolve, reject) => {

            App.displayAlert({
                text: text,
                cancelable: false,
                icon: icon,
                buttonLeft: {
                    text: translate.get('generic.yes'),
                    onClick: () => {
                        resolve(true);
                    }
                },
                buttonRight: {
                    text: translate.get('generic.no'),
                    onClick: () => {
                        reject();
                    }
                }
            });

        });

    }

    static cropImage(url: string) : Promise<string> {
        
        return new Promise((resolve, reject) => {

            this.modal.open({
                component: Cropper,
                class: 'cropper-modal',
                props: {
                    src: url,
                    onSave: (src: string) => {
                        resolve(src);
                    }
                }
            });

        });

    }

    static modelSelect(props: {
        search: (text?: string) => Promise<any[]>,
        item: (model: any) => {
            component?: any,
            props?: any,
            content?: any,
        },
        emptyMessage?: string,
        multiple?: boolean,
        comparer?: (a: any, b: any) => boolean,
        initial?: any|any[]
    }) {

        return new Promise((resolve, reject) => {

            let attrs : any = {
                item: props.item,
                search: props.search,
                onSave: (selected: any) => {
                    resolve(selected);
                }
            };

            if (props.emptyMessage) 
            attrs['emptyMessage'] = props.emptyMessage;

            if (props.multiple) 
            attrs['multiple'] = props.multiple;

            if (props.initial)
            attrs['initial'] = props.initial;

            if (props.comparer)
            attrs['comparer'] = props.comparer;

            this.modal.open({
                component: ModelSelect,
                props: attrs
            });

        });

    }

    static loading() {
        this.modal.open({
            component: ScreenLoader,
            class: 'fullscreen-loader-modal',
            props: {
                color: 'white'
            }
        });
    }

    static stopLoading() {
        this.modal.close();
    }

}