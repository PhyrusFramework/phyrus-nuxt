import Vue from 'vue';

export type AppNotificationsInterface = {
    _ref: any,
    setReference: (ref: any) => void,
    add: (type : 'error'|'success'|'warning'|'info', message: string) => void,
    addCustom: (component: any, props: any) => void,
    closeNotification: (notification: any) => void,
    closeLast: () => void,
    closeFirst: () => void
}

export default Vue.extend({

    props: [],

    data: function() {

        let data : {notifications: any[]} = {
            notifications: []
        };

        return data;
    },

    methods: {

        addCustom(component: any, props: any = {}) {

            let not = {
                type: 'custom',
                component: component,
                props: props,
                status: 'opening'
            }

            this._addNotification(not);

            return not;

        },

        add(type : 'error'|'success'|'warning'|'info', message: string) {

            let icon = 'x';
            switch(type) {
                case 'error':
                    icon = 'x';
                    break;
                case 'success':
                    icon = 'check';
                    break;
                case 'info':
                    icon = 'information-circle';
                    break;
                case 'warning':
                    icon = 'exclamation';
                    break;
            }

            let not = {
                type: type,
                message: message,
                icon: icon,
                status: 'opening'
            }

            this._addNotification(not);

            return not;
        },

        _addNotification(not: any) {
            if (this.notifications.length >= 8) {
                this.notifications.splice(0, 1);
            }

            this.notifications.push(not);

            setTimeout(() => {
                not.status = 'open';
            }, 10);

            setTimeout(() => {
                not.status = 'opening';

                setTimeout(() => {
                    this.closeNotification(not);
                }, 500);
               
            }, 5000);
        },

        classForElement(notification: any) {
            let cl : any = {
                open: notification.status == 'open'
            }

            cl[notification.type] = true;

            return cl;
        },

        closeNotification(notification: any) {
            this.notifications.splice( this.notifications.indexOf(notification), 1);
        },

        closeLast() {
            this.notifications.splice( this.notifications.length - 1, 1);
        },

        closeFirst() {
            this.notifications.splice( 0, 1);
        },

        closeAll() {
            this.notifications = [];
        }
    }

})