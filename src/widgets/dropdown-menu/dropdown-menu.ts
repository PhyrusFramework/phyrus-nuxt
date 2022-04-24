import Vue from 'vue';

export default Vue.extend({

    name: 'dropdown-menu',
   
    props: [ 'item', 'depth', 'onItemSelected', 'parent'],

    data() {

        let data : {
            expanded: boolean
        } = {
            expanded: false
        }

        return data;

    },

    methods: {
        select(item: any) {

            this.close();

            if (this.onItemSelected) {
                this.onItemSelected(item);
            }

            this.$emit('selected', item);
        },

        clickedChild(item: any) {
            this.select(item);
        },

        close() {
            this.expanded = false;

            if (this.parent) {
                this.parent.close();
            }
        },

        asParent() { return this; }
    }

});