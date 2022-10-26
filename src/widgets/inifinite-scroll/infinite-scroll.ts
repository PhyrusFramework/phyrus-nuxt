import Vue from 'vue';
import Loader from '../loader/loader.vue';

export default Vue.extend({

    components: {Loader},

    props: [ 'onLoadMore', 'threshold', 'list', 'emptyMessage', 'reverse', 'scroller' ],

    data() {
        let data : {
            loading: boolean,
            finished: boolean,
            scrollPosition: number
        } = {
            loading: false,
            finished: false,
            scrollPosition: 0
        }

        return data;
    },

    created() {
        this.load();

        window.addEventListener('scroll', () => {
            this.handleScroll(null);
        });
    },

    methods: {

        scrollTo(position: number) {
            (this.$refs.container as any).scrollTop = position;
        },

        el() {
            return this.scroller ? this.scroller : window;
        },

        detectScroll() {

            const e = this.el();

            let position = 0;
            if (this.scroller) {
                position = e.scrollTop + e.clientHeight;
            } else {
                position = e.scrollY + e.innerHeight;
            }
            
            let mark = (this.$refs.mark as any);
            let container = (this.$refs.container as any);
            let threshold = this.threshold ? this.threshold : 50;

            this.scrollPosition = container.scrollTop;
            this.$emit('scrolling', this.scrollPosition);

            if (!this.reverse) {
                if (position + container.scrollTop >= mark.offsetTop - threshold) {
                    return true;
                }
            } else {
                if (container.scrollTop <= mark.offsetTop + threshold) {
                    return true;
                }
            }

            return false;

        },

        handleScroll(e:any) {

            if (!this.onLoadMore) return;
            if (this.loading) return;
            if (this.finished) return;

            if (this.detectScroll()) {
                this.load();
            }

        },

        reset() {
            this.loading = false;
            this.finished = false;
            this.load();
        },

        load() {
            if (!this.onLoadMore) {
                console.log("Infinite Scroll needs an onLoadMore function");
                return;
            }

            this.loading = true;

            this.onLoadMore({
                stop: (finish = false) => {
                    this.loading = false;
                    this.finished = finish;
                }
            });
        }
    }

});