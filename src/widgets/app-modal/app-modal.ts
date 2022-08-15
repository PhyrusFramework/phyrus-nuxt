import Vue from 'vue';

type ModalType = {
    component: any,
    componentProps: any,
    cancelable: boolean,
    status: 'opening'|'open',
    width?: string,
    class?: string,
    noPadding?: boolean,
    onClose?: () => void
}

type ModalOptions = {
    component: any, 
    props?: any, 
    cancelable?: boolean,
    width?: string,
    class?: string,
    noPadding?: boolean,
    onClose?: () => void
}

export type AppModalInterface = {

    _ref: any,
    setReference: (ref: any) => void,

    modals: ModalType[],

    open: (options: ModalOptions) => void,

    close: () => Promise<any>

}

export default Vue.extend({

    props: [ ],

    data: function() {

        let data : {
            modals: ModalType[],
            closing: boolean
        } = {
            modals: [],
            closing: false
        }

        return data;
    },

    methods: {

        classForModal(modal: any) {
            let cl : any = {open: modal.status == 'open'};
            if (modal.class) {
                cl[modal.class] = true;
            }
            if (modal.noPadding) {
                cl['no-padding'] = true;
            }
            return cl;
        },

        open(options: ModalOptions) {

            if (this.closing) {
                setTimeout(() => {
                    this.open(options);
                }, 150);
                return;
            }

            let modal : any = {
                component: options.component,
                componentProps: options.props ? options.props : {},
                cancelable: options.cancelable,
                width: options.width,
                status: 'opening',
                class: options.class,
                noPadding: options.noPadding ? true : false,
                onClose: options.onClose
            };

            this.modals.push(modal);

            setTimeout(() => {
                modal.status = 'open';
            }, 10);
        },

        close() : Promise<any> {

            return new Promise((resolve, reject) => {

                if (this.modals.length == 0) {
                    resolve(true);
                    return;
                }
    
                let last = this.modals[this.modals.length - 1];
                last.status = 'opening';

                this.closing = true;
                setTimeout(() => {
                    this.modals.splice(this.modals.length - 1, 1);
                    if (last.onClose) {
                        last.onClose();
                    }
                    resolve(true);
                    this.closing = false;
                }, 300);

            });

        }
    }

})