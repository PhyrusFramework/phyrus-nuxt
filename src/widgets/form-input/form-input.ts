import Vue from 'vue';
import SliderSelect from '../slider-select/slider-select.vue';
import Toggle from '../toggle/toggle.vue';
import intlTelInput from 'intl-tel-input';
import countryData from 'countries-and-timezones';
import Multiselect from '../multiselect/multiselect.vue';
import Editor from '../editor/editor.vue';
import IconPopup from '../icon-popup/icon-popup.vue';
import Calendar from '../calendar/calendar.vue';
import Time from '../../modules/time';
import Utils from '../../modules/utils';

export default Vue.extend({

    name: 'form-input',

    components: { SliderSelect, Toggle, Multiselect, Editor, IconPopup, Calendar },

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
        'clearx',

        // Select
        'component',
        'props',
        'onKey',
        'beforeChange',

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
        'mode',

        // Time
        'time',

        // Date
        'dateFormat',

        // Calendar
        'range'
    ],

    data: function() {

        let data : {
            character_count: number,
            displayContent: boolean,
            iti: any,
            pseudoValue: any,
            reloading: boolean
        } = {
            character_count: 0,
            displayContent: false, // for passwords,
            iti: null,
            pseudoValue: null,
            reloading: false
        }
        return data;
    },

    created() {
        if (this.length && this.value && typeof this.value == 'string') {
            this.character_count = this.value.length;
        }

        if (this.type == 'time') {
            this.pseudoValue = {
                hour: '00',
                minute: '00'
            }

            if (this.time) {
                const parts = this.time.split(':');
                this.pseudoValue.hour = parts[0];
                this.pseudoValue.minute = parts[1];
            }
        }

        if (this.type == 'datetime') {
            this.pseudoValue = {
                date: '',
                time: ''
            }

            if (this.time || this.value) {
                const v = this.value ? this.value : this.time;

                let parts = v.split(' ');
                if (parts.length < 2) {
                    parts = v.split('T');
                }

                if (parts.length == 2) {
                    this.pseudoValue.date = parts[0];

                    let times = parts[1].split(':');
                    this.pseudoValue.time = times[0] + ':' + times[1];
                }
            }
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

            this.iti.telInput.addEventListener('keydown', ($e: any) => {

                if ([8, 9, 39, 37, 46].includes($e.keyCode)
                || [
                    'Tab',
                    'BackSpace',
                    'ArrowRight',
                    'ArrowLeft',
                    'Delete'
                ].includes($e.key)) {
                    return
                }

                const valid = "0123456789";
                if (!valid.includes($e.key)) {
                    $e.preventDefault();
                }
            });

            this.iti.telInput.addEventListener('keyup', () => {
                this.phoneChange();
            });

            if (this.value) {
                this.iti.setNumber(this.value);
            }

        }
    },

    methods: {

        passEvent(name: string, args: any) {

            const paramName = 'on' + name[0].toUpperCase() + name.substring(1);
            const t = (this as any);

            if (t[paramName]) {
                t[paramName](args);
            }

            this.$emit(name, args);
        },

        isDisabled() {
            if (this.readonly) return true;
            if (!this.disabled) return false;
            if (typeof this.disabled == 'boolean') return true;
            return this.disabled();
        },

        optionsForSelect() {
            if (this.options) return this.options;

            let list : {label: string, value: string}[] = [];

            if (this.type == 'country') {

                let countries : any = countryData.getAllCountries();

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

        getValue() {
            let v = this.value;

            if (this.type == 'date' && !this.dateFormat) {
                v = v.format('YYYY-MM-DD');
            }

            return v;
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
            else if (['date'].includes(this.type)) {

                const t = new Time(v);

                if (this.dateFormat) {
                    v = t.format(this.dateFormat);
                }
                else {
                    v = t;
                }

            }

            if (this.length && typeof(v) == 'string' && this.type != 'editor' && v.length > this.length) {
                v = v.substring(0, this.length);
            }

            this.$emit('input', v);

            if (v && !['calendar'].includes(this.type)) {
                if (this.type != 'editor')
                    this.character_count = v.length;
                else
                    this.character_count = Utils.stripTags(v).length;
            }

            if (this.onChange) {
                this.onChange(v);
            }
            this.$emit('change', v);

            if (v != value)
                this.$forceUpdate();
        },

        lengthOverpassed() {
            return this.length && this.character_count > this.length;
        },

        reload() {
            this.reloading = true;
            setTimeout(() => {
                this.reloading = false;
            }, 5);
        },

        clear(value: any = '') {

            if (this.type == 'calendar') {
                (this.$refs.calendar as any).emit(null);
                return;
            }

            this.emit(value);

            if (['select'].includes(this.type)) {
                this.reload();
            }
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

        },

        timeChanged() {

            if (this.type == 'time') {

                let hourNum = Number(this.pseudoValue.hour);
                let timeNum = Number(this.pseudoValue.minute);

                if (hourNum < 0) {
                    hourNum = 0;
                } else if (hourNum > 23) {
                    hourNum = 23;
                }
    
                if (timeNum < 0) {
                    timeNum = 0;
                } else if (timeNum > 59) {
                    timeNum = 59;
                }
    
                ////
    
                let hour = "" + hourNum;
                let minute = "" + timeNum;
    
                if (hour.length < 1) hour = "0" + hour;
                if (minute.length < 1) minute = "0" + minute;
                if (hour.length < 2) hour = "0" + hour;
                if (minute.length < 2) minute = "0" + minute;

                this.pseudoValue = {
                    hour: hour,
                    minute: minute
                }
    
                this.emit(hour + ":" + minute);
    

            } else { // date time

                this.emit(this.pseudoValue.date + ' ' + this.pseudoValue.time);

            }

            
        },

        setPhoneNumber(number: string) {
            this.iti.setNumber(number);
        },

        setPhoneCountry(countryCode: string) {
            this.iti.setCountry(countryCode);
        },

        emitCalendarDate(val: any) {

            if (!val) {
                this.emit(null);
                return;
            }

            if (!this.range)
                this.emit(Time.instance(val));
            else
                this.emit([Time.instance(val[0]), Time.instance(val[1])]);

            setTimeout(() => {
                let ref: any = this.$refs.iconPopup;
                if (ref) ref.close();
            }, 100);
        },

        calendarValueLabel() {
            if (!this.range)
                return this.value ? this.value.date() : (this.placeholder ? this.placeholder : 'DD/MM/YYYY');

            if (!this.value) return this.placeholder;
            return this.value[0].date() + ' - ' + this.value[1].date();
        },

        clickOnCalendar() {
            (this.$refs.iconPopup as any).toggle();
        }

    }

})