import Vue from 'vue';
import SliderSelect from '../slider-select/slider-select.vue';
import Toggle from '../toggle/toggle.vue';
import intlTelInput from 'intl-tel-input';
import countryData from 'countries-and-timezones';
import Multiselect from '../multiselect/multiselect.vue';
import Editor from '../editor/editor.vue';

export default Vue.extend({

    components: { SliderSelect, Toggle, Multiselect, Editor },

    props: [ 
        'type', 
        'label', 
        'placeholder', 
        'options',
        'rows', 
        'length',
        'max',
        'min',
        'step',
        'onChange',
        'inverted',
        'error',
        'onPressEnter',
        'disabled',
        'readonly',
        'onFocus',
        'suggestions',
        'suggestionsKey',
        'onSuggestionSelected',
        'value',
        'required',

        // Radio
        'option',
        'labelClickable',

        // Number
        'hideControls',

        // Countries
        'defaultCountries',
 
        // Toggle
        'size',

        // Phone
        'initialCountry',

        // Multiselect
        'multiple',
        'separator',
        'comparer',

        // Editor
        'mode'
    ],

    data: function() {

        let data : {
            character_count: number,
            displayContent: boolean,
            iti: any
        } = {
            character_count: 0,
            displayContent: false, // for passwords,
            iti: null
        }
        return data;
    },

    created() {
        if (this.length && this.value && typeof this.value == 'string') {
            this.character_count = this.value.length;
        }
    },

    mounted() {
        if (this.type == 'phone') {

            let options : any = {
                separateDialCode: true,
                preferredCountries: ["es", "fr", "gb", "us", "it", "de"]
            }

            if (this.initialCountry) {
                options['initialCountry'] = this.initialCountry;
            }

            if (this.placeholder) {
                options['customPlaceholder'] = (country: any, data: any) => {
                    return this.placeholder;
                }
            }

            this.iti = intlTelInput((this.$refs.phoneInput as any), options);

            this.iti.telInput.addEventListener('countrychange', () => {
                this.phoneChange();
            });

            this.iti.telInput.addEventListener('keyup', () => {
                this.phoneChange();
            });

        }
    },

    methods: {

        optionsForSelect() {
            if (this.options) return this.options;

            let list : {label: string, value: string}[] = [];

            if (this.type == 'country') {

                let countries : any = countryData.getAllCountries();
                countries['ES'].name = 'España';

                if (this.defaultCountries) {
                    for(let country of this.defaultCountries) {
                        let code = country.toUpperCase();
                        let c = countries[code];
                        delete countries[code];

                        list.push({
                            label: c.name,
                            value: c.name
                        });
                    }
                }

                Object.keys(countries).forEach(k => {
                    list.push({
                        label: countries[k].name,
                        value: countries[k].name
                    });
                });
            }

            return list;
        },

        phoneChange() {
            let number = this.iti.telInput.value;
            let data = this.iti.getSelectedCountryData();

            let result = {
                number: number,
                prefix: data.dialCode,
                country: data.iso2
            }

            this.$emit('input', result.prefix + result.number);

            if (this.onChange) {
                this.onChange(result);
            }

            this.$emit('change', result);
        },

        emit(value: any) {

            let v = value;

            if (['number', 'numeric'].includes(this.type)) {

                if (this.max) {
                    if (Number(v) > Number(this.max)) {
                        v = Number(this.max);
                    }
                }
                
                if (this.min !== undefined && this.min !== null) {
                    if (Number(v) < Number(this.min)) {
                        v = Number(this.min);
                    }
                }
            }

            this.$emit('input', v);

            if (this.length) {
                this.character_count = v.length;
            }

            if (this.onChange) {
                this.onChange(v);
            }
            this.$emit('change', v);

            if (v != value)
                this.$forceUpdate();
        },

        clear() {
            this.emit('');
        },

        onSubmit() {
            this.$emit('pressEnter', this.value);

            if (this.onPressEnter) {
                this.onPressEnter(this.value);
            }
        },

        focused() {
            this.$emit('focus', this);

            if (this.onFocus) {
                this.onFocus(this);
            }
        },

        selectSuggestion(s: any) {

            if (!this.onSuggestionSelected) return;
            this.onSuggestionSelected(s.item);
        },

        changePasswordVisibility() {
            this.displayContent = !this.displayContent;
        },

        focus() {

            if (this.type == 'password') {
                (this.$refs.passwordInput as any).focus();
            }

            else if (this.type == 'textarea') {
                (this.$refs.textareaInput as any).focus();
            }

            else if (!this.type || ['text', 'number', 'email', 'date', 'color'].includes(this.type)) {
                (this.$refs.normalInput as any).focus();
            }

        }

    }

})