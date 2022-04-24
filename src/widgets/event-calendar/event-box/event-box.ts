import Vue from 'vue';

export default Vue.extend({

    props: [ 'event' ],

    methods: {
        handleClick(event: any) {
            if (event.onClick) {
                event.onClick();
                return;
            }

            if (event.popup) {

                if (event.popupVisible == 0) {
                    event.popupVisible = 1;

                    setTimeout(() => {
                        event.popupVisible = 2;
                        this.$forceUpdate();
                    }, 5);
                } else {
                    event.popupVisible = 1;

                    setTimeout(() => {
                        event.popupVisible = 0;
                        this.$forceUpdate();
                    }, 300);
                }

                this.$forceUpdate();

            }
            
        }
    }

})