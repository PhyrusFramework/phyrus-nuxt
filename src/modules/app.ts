import Alert from '../modals/alert/alert.vue';
import { AppModalInterface, ModalOptions } from '../widgets/app-modal/app-modal';
import { AppNotificationsInterface } from '../widgets/app-notifications/app-notifications';
import { DrawerButton, DrawerInterface, DrawerOptions } from '../widgets/drawer/drawer';
import { ZoomImageInterface } from '../widgets/zoom-image/zoom-image';
import translate from './translator';
import Cropper from '../modals/cropper/cropper.vue';
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

        open(options: DrawerOptions) {
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
    
        open(options: ModalOptions) {
            if (!this._ref) {
                return;
            }

            this._ref.open(options);
        },

        get current() : ModalType|null {
            if (!this._ref) return null;
            if (this._ref.modals.length == 0) return null;
            return this._ref.modals[this._ref.modals.length - 1];
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
        icon?: string|null,
        buttonLeft?: {text: string, onClick: () => void},
        buttonRight?: {text: string, onClick: () => void},
        onClose?: () => void,
        onPressX?: () => void
    }) {
        App.modal!.open({
            component: Alert,
            cancelable: props.cancelable,
            props: {
                ...props,
                onPressX: props.onPressX
            },
            onClose: props.onClose
        });
    }

    static confirmation(text: string, options?: {
        icon?: string|null,
        yes?: string,
        no?: string
    }) : Promise<any> {

        return new Promise((resolve, reject) => {

            App.displayAlert({
                text: text,
                cancelable: false,
                icon: options ? options.icon : undefined,
                buttonLeft: {
                    text: options && options.no ? options.no : translate.get('generic.no'),
                    onClick: () => {
                        reject();
                    }
                },
                buttonRight: {
                    text: options && options.yes ? options.yes : translate.get('generic.yes'),
                    onClick: () => {
                        resolve(true);
                    }
                }
            });

        });

    }

    static cropImage(url: string, ratio: number = 0) : Promise<string> {
        
        return new Promise((resolve, reject) => {

            let props: any = {
                src: url,
                onSave: (src: string) => {
                    resolve(src);
                }
            }

            if (ratio > 0) {
                props['ratio'] = ratio;
            }

            this.modal.open({
                component: Cropper,
                class: 'cropper-modal',
                props: props
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