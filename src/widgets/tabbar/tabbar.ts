import Vue from 'vue';

export default Vue.extend({

    props: [ 'tabs', 'onTabSelected', 'value' ],

    data() {
        const data : {
            canChange: boolean
        } = {
            canChange: true
        }
        return data;
    },

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

        preventChange() {
            this.canChange = false;

            setTimeout(() => {
                this.canChange = true;
            }, 10);
        },

        setTab(tab: any) {
            this.$emit('input', tab.key);
            this.$emit('change', tab.key);

            if (this.onTabSelected) {
                this.onTabSelected(tab.key);
            }
        },

        selectTab(tab: any) {

            this.$emit('input', '');

            setTimeout(() => {

                this.$emit('beforeChange', {tab: tab, tabbar: this, confirm: () => {
                    this.setTab(tab);
                }});
    
                if (!this.canChange) return;
    
                this.setTab(tab);

            }, 10);

        }

    }

})