import Vue from 'vue';
import Utils from '../../modules/utils';

export default Vue.extend({

    name: 'tree-view',

    props: ['item', 
    'childrenKey', 
    'depth', 
    'value', 
    'activeColor', 
    'avoidFirst',
    'comparer',
    'paddingPerLevel'
    ],

    created() {
        if (this.depth) {
            this.depthLevel = this.depth;
        }
    },

    data() {
        let data : {
            expanded: boolean,
            depthLevel: number
        } = {
            expanded: false,
            depthLevel: this.avoidFirst ? -1 : 0
        }

        return data;
    },

    methods: {

        close() {
            this.expanded = false;

            let children = this.$refs.childTree;

            if (!children || !Array.isArray(children)) {
                return;
            }

            for(let n of (this.$refs.childTree as any[])) {
                n.close();
            }
        },

        select() {
            if (this.value === undefined) {
                return;
            }
            let val : any = this.item;
            if (this.isSelected()) {

                // Remove
                if (this.value && Array.isArray(this.value)) {
                    val = this.value;
                    val.splice( this.getIndex(), 1 );
                } else {
                    val = null;
                }

            } else {

                // Add
                if (this.value && Array.isArray(this.value)) {
                    val = this.value;
                    val.push(this.item);
                } else {
                    val = this.item;
                }

            }

            this.$emit('change', val);
            this.$forceUpdate();

        },

        getPadding() {
            let p = this.paddingPerLevel ? this.paddingPerLevel : 20;
            return this.depthLevel > 0 ? p * this.depthLevel : 0;
        },

        getChildren() {
            if (!this.item) return [];

            return Utils.dotNotation(this.item, this.childrenKey ? this.childrenKey : 'children', '');
        },

        getIndex() {
            let i = 0;
            let b = false;
            for(let val of this.value) {

                if (!this.comparer) {
                    b = val == this.item;
                } else if (!val || !this.item) {
                    b = false;
                } else {
                    b = this.comparer(this.item, val);
                }

                if (b) {
                    return i;
                }

                ++i;
            }
        },

        isSelected() {
            let arr = Array.isArray(this.value) ? this.value : [this.value];

            let item = this.item;
            let b = false;

            for(let it of arr) {

                if (!this.comparer) {
                    b = it == item;
                } else if (!item || !it) {
                    b = false;
                } else {
                    b = this.comparer(item, it);
                }

                if (b) return true;
            }

            return false;
        }

    }

});