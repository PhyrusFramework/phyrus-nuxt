import Vue from 'vue';

export default Vue.extend({

    props: ['model', 'options', 'color', 'size', 'padding', 'background', 'effect'],

    data() {

        let s = ( this.size ? this.size : 40 ) + 'px';
        let p = ( this.padding ? this.padding : 5) + 'px';

        return {
          open: false,
          closable: false,
          btnStyle: {
              width: s,
              height: s,
              padding: p
          }
        }
    },

    created() {
        document.body.addEventListener('click', () => {

            if (!this.closable) return;

            setTimeout(() => {
                this.open = false;
                this.closable = false;
            }, 50);
        }, true); 
    },

    methods: {

        openMenu() {
            if (!this.open) {
                this.open = true;
                setTimeout(() => {
                    this.closable = true;
                }, 100);
            }
        },

        selectOption(option: {label: string, onSelected: (model?: any) => void}) {
            option.onSelected(this.model);
        }

    }
})