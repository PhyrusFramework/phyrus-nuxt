import Vue from 'vue';
import App from '../../modules/app';
import translate from '../../modules/translator';

export default Vue.extend({

    props: [ 
        'size', 
        'padding', 
        'width', 
        'activeColor', 
        'inactiveColor', 
        'backgroundColor', 
        'confirmation', 
        'value', 
        'onChange' ],

    methods: {

        toggleStyle() {
    
            let s = this.size && typeof this.size == 'number' ? this.size : 30;
            let p = this.padding ? this.padding : 3;
            let bs = (s - p*2);
            let w = this.width ? this.width : p + bs*2 + p;
    
            if (this.size == 'medium') {
                s = s/1.2;
                p = p/1.2;
                bs = bs/1.2;
                w = w/1.2;
            } else if (this.size == 'small') {
                s = s/1.6;
                p = p/1.6;
                bs = bs/1.6;
                w = w/1.6;
            }
    
            return {
                'background-color': this.backgroundColor ? this.backgroundColor : 'white',
                width: w + 'px',
                height: s + 'px',
                'border-radius': (s/2) + 'px',
                padding: p + 'px'
            }
        },

        thumbStyle() {

            let s = this.size && typeof(this.size) == 'number' ? this.size : 30;
            let p = this.padding ? this.padding : 3;
            let bs = (s - p*2);

            if (this.size == 'medium') {
                s = s/1.2;
                p = p/1.2;
                bs = bs/1.2;
            } else if (this.size == 'small') {
                s = s/1.6;
                p = p/1.6;
                bs = bs/1.6;
            }

            return {
                width: bs + 'px',
                height: bs + 'px',
                'background-color': this.value ?
                 (this.activeColor ? this.activeColor : 'var(--primary-color)') :
                 (this.inactiveColor ? this.inactiveColor : 'var(--gray)')
            };
        },

        setValue(v: boolean) {
            this.$emit('input', v);

            if (this.onChange) {
                this.onChange(v);
            }
            this.$emit('change', v);
        },

        toggle() {

            if (!this.confirmation) {
                this.setValue(!this.value);
                return;
            }

            let popup = (obj: any) => {
                App.displayAlert({
                    text: translate.get(obj.text),
                    cancelable: false,
                    buttonLeft: {
                        text: translate.get('generic.yes'),
                        onClick: () => {
                            this.setValue(!this.value);

                            if (obj.onConfirm) {
                                obj.onConfirm();
                            }
                        }
                    },
                    buttonRight: {
                        text: translate.get('generic.no'),
                        onClick: () => {}
                    }
                })
            }

            if (this.value) {
                if (this.confirmation.disabled) {
                    popup(this.confirmation.disabled);
                } else {
                    this.setValue(false);
                }
            } else {
                if (this.confirmation.enabled) {
                    popup(this.confirmation.enabled);
                } else {
                    this.setValue(true);
                }
            }


        }
        
    }

})