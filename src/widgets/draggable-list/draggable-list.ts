import Vue from 'vue';
import draggable from 'vuedraggable';

export default Vue.extend({

    components: { draggable },

    props: ['value', 'onChange', 'group', 'setRef'],

    mounted() {
        if (this.setRef) {
            this.setRef(this);
        }
    },

    methods: { 

        emit(position: {old: number, new: number}) {
            this.$emit('input', this.value);

            const param = {
                list: this.value,
                old: position.old,
                new: position.new
            }

            this.$emit('change', param);
                
            if (this.onChange) {
                this.onChange(param);
            }
        },

        manageDragging(e: any) {
            setTimeout(() => {
                this.emit({
                    old: e.oldIndex,
                    new: e.newIndex
                });
            }, 5);
        },

        addItem(item: any) {
            this.value.push(item);
            this.emit({
                old: this.value.length - 1,
                new: this.value.length
            });
        },

        removeItem(position: number) {
            this.value.splice(position, 1);
            this.emit({
                old: position,
                new: position
            });
        },

        clearItems() {
            const l = this.value.length;

            while(this.value.length > 0) {
                this.value.splice(0, 1);
            }

            this.emit({
                old: l,
                new: 0
            });
        }

    }

});