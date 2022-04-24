import SearchBar from '../../widgets/searchbar/searchbar.vue';
import InfiniteScroll from '../../widgets/inifinite-scroll/infinite-scroll.vue';
import AppComponent from '../../modules/app-component';
import Utils from '../../modules/utils';
import App from '../../modules/app';

export default AppComponent.extend({

    components: {SearchBar, InfiniteScroll},

    props: ['search', 'emptyMessage', 'multiple', 'item', 'comparer', 'searchbar', 'onSave', 'initial'],

    data() {
        let data : {
            modelName: string,
            items: any[]|null,
            selecteds: any[],
            initials: any[],
            compare: (a: any, b: any) => boolean
        } = {
            modelName: '',
            items: null,
            selecteds: [],
            initials: [],
            compare: (a: any, b: any) => a == b
        };

        return data;
    },

    created() {
        if (this.comparer) {
            this.compare = this.comparer;
        }

        if (this.initial) {
            if (this.multiple) {
                for(let it of this.initial) {
                    this.initials.push(it);
                }
            } else {
                this.initials.push(this.initial);
            }
        }
    },

    methods: {

        close() {
            App.modal.close();
        },

        submit() {

            let result = this.multiple ? this.selecteds : this.selecteds[0];

            if (this.onSave) {
                if (this.onSave(result) === false) {
                    return;
                }
            }

            this.close();
        },

        resetSearch() {
            this.items = null;
            (this.$refs.scroller as any).load();
        },

        doSearch($e: any) {

            this.search(this.modelName)
            .then((items: any[]) => {

                // Check if it was initially selected
                for(let it of items) {
                    for(let i = 0; i < this.initials.length; ++i) {
                        if (this.compare(it, this.initials[i])) {
                            this.selecteds.push(it);
                            this.initials.splice(i, 1);
                            break;
                        }
                    }
                }

                this.items = Utils.addToList(this.items, items);
                $e.stop(this.items.length == 0);
            })
            .catch(() => {
                $e.stop(true);
            });
        },

        getItems() {
            return this.items;
        },

        select(it: any) {
            if (this.isSelected(it)) {
                if (!this.multiple) {
                    this.selecteds = [];
                } else {
                    for(let i = 0; i < this.selecteds.length; ++i) {
                        if (this.compare(it, this.selecteds[i])) {
                            this.selecteds.splice(i, 1);
                            break;
                        }
                    }
                }
            } else {
                if (this.multiple) {
                    this.selecteds.push(it);
                } else {
                    this.selecteds = [it];
                }
            }
        },

        isSelected(it: any) {
            for(let s of this.selecteds) {
                if (this.compare(s, it)) {
                    return true;
                }
            }
            return false;
        }
    }
});