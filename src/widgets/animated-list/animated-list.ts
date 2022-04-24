import Vue from 'vue';

export default Vue.extend({

    props: ['list', 'transition'],

    data() {
        let data : {
            animated: any[],
            animOut: any[],
            time: number
        } = {
            animated: [],
            animOut: [],
            time: 300
        }
        return data;
    },

    created() {
        if (this.transition) {
            this.time = this.transition;
        }
    },

    methods: {

        add(item: any) {
            if (!this.list) return;

            this.list.push(item);
            this.animated.push(item);

            setTimeout(() => {
                let index = this.animated.indexOf(item);
                if (index >= 0) {
                    this.animated.splice(index, 1);
                }
                this.animOut.push(item);
                setTimeout(() => {
                    let index = this.animOut.indexOf(item);
                    if (index >= 0) {
                        this.animOut.splice(index, 1);
                    }
                }, this.time);
            }, 10);
        
        },

        remove(item: any) {

            if (!this.list) return;

            this.animated.push(item);

            setTimeout(() => {
                let index = this.animated.indexOf(item);
                if (index >= 0) {
                    this.animated.splice(index, 1);
                }
                
                index = this.list.indexOf(item);
                if (index >= 0) {
                    this.list.splice(index, 1);
                }
            }, this.time);

        },

        removeAt(index: number) {

            const item = this.list[index];
            this.animated.push(item);

            setTimeout(() => {
                this.animated.splice(this.animated.length - 1, 1);
                
                this.list.splice(index, 1);
            }, this.time);

        }
        
    }

});