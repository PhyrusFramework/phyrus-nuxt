import Vue from 'vue';

export type DrawerButton = {
    text: string,
    onClick?: (ref: any) => void,
    icon?: string,
    enabled?: () => boolean,
    class?: string
}

export type DrawerOptions = {
    component: any,
    props?: any,
    title?: string,
    buttonLeft?: DrawerButton,
    buttonRight?: DrawerButton,
    maxWidth?: string,
    onClose?: () => any
};

export type DrawerInterface = {

    _ref: any,
    setReference: (ref: any) => void,

    setTitle: (title: string) => void,
    setButtonLeft : (btn: DrawerButton) => void,
    setButtonRight: (btn: DrawerButton) => void
    onClose: (func: () => any) => void,

    open: (options: DrawerOptions) => void,

    close: () => Promise<any>

}

export default Vue.extend({

    data: function() {
        let data : {
            component: any,
            componentProps: any,
            isOpening: boolean,
            isOpen: boolean,
            title: string,
            buttonLeft: any,
            buttonRight: any,
            maxWidth: string,
            onClose: () => any
        } = {
            component: null,
            componentProps: {},
            isOpening: false,
            isOpen: false,
            title: '',
            buttonLeft: null,
            buttonRight: null,
            maxWidth: '40%',
            onClose: () => {}
        }

        return data;
    },

    methods: {

        open(options: {
            component: any,
            props?: any,
            title?: string,
            buttonLeft?: DrawerButton,
            buttonRight?: DrawerButton,
            maxWidth?: string,
            onClose?: () => any
        }) {

            this.component = options.component;
            this.componentProps = options.props ? options.props : {};
            this.title = options.title ? options.title : '';

            this.buttonLeft = options.buttonLeft;
            this.buttonRight = options.buttonRight;
            this.maxWidth = options.maxWidth ? options.maxWidth : '40%';
            this.onClose = options.onClose ? options.onClose : () => new Promise((resolve) => resolve(true));

            this.isOpening = true;
            setTimeout(() => {
                this.isOpen = true;
            }, 10);
        },

        closeButton() {

            if (this.onClose) {
                this.onClose()
                .then((response: boolean) => {
                    if (response) {
                        this.close();
                    }
                });
                return;
            }

            this.close();

        },

        close() {

            return new Promise((resolve, reject) => {
                this.isOpen = false;
                setTimeout(() => {
                    this.isOpening = false;
                    this.component = null;
                    this.componentProps = {};
                    resolve(true);
                }, 500);
            });
        },

        footerButtonClick(btn: any) {
            if (!btn.enabled || btn.enabled())
                btn.onClick(this.$refs.componentRef);
        },

        footerButtonColor(btn: any) {
            if (!btn.enabled || btn.enabled()) {
                return 'var(--primary-color)';
            }

            return 'var(--gray)';
        }
    }

})