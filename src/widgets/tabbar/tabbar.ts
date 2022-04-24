import Vue from 'vue';

export default Vue.extend({

    props: [ 'tabs', 'onTabSelected', 'value' ],

    created() {

        if (!this.tabs || this.tabs.length == 0) {
            return;
        }

        for(let tab of this.tabs) {
            if (tab.active) {
                this.$emit('input', tab);
            }
        }

        if (!this.value) {
            this.$emit('input', this.tabs[0]);
        }
    },

    methods: {

        selectTab(tab: any) {
            this.$emit('input', tab.key);

            if (this.onTabSelected) {
                this.onTabSelected(tab.key);
            }
            this.$emit('change', tab.key);
        }

    }

})