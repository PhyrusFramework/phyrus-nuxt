import Vue from 'vue';
import Loader from '../loader/loader.vue';

export default Vue.extend({

    components: {Loader},

    props: [ 'onLoadMore', 'threshold', 'list', 'emptyMessage' ],

    data() {
        let data : {
            loading: boolean,
            finished: boolean
        } = {
            loading: false,
            finished: false
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

        detectScroll() {

            let position = window.scrollY + window.innerHeight;
            let mark = (this.$refs.mark as any);
            let container = (this.$refs.container as any);
            let threshold = this.threshold ? this.threshold : 50;

            if (position + container.scrollTop >= mark.offsetTop - threshold) {
                return true;
            }

        },

        handleScroll(e:any) {

            if (!this.onLoadMore) return;
            if (this.loading) return;
            if (this.finished) return;

            // New method
            if (this.detectScroll()) {
                this.load();
            }

            // Old method
            /*if (Utils.scrollBottomReached(e, this.threshold)) {
                this.load();
            }*/

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