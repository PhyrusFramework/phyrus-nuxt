import Vue from 'vue';
import FormInput from '../form-input/form-input';
import Dropzone from '../dropzone/dropzone.vue';
import CircleImage from '../circle-image/circle-image.vue';
import translate from '../../modules/translator';
import Utils from '../../modules/utils';
import Validator from '../../modules/validator';

export default Vue.extend({

    components: { FormInput, Dropzone, CircleImage },

    props: ['form'],

    data() {
        let data : {
            rows: (any[])[]|null,
            previousValues: any
            valuesChanged: string[]
        } = {
            rows: null,
            previousValues: {},
            valuesChanged: []
        }
        return data;
    },

    created() {
        this.initialize(true, true);
    },

    methods: {

        initialize(inmediate: boolean = false, copyPreviousValues: boolean = false) {

            return new Promise((resolve, reject) => {

                this.rows = [];

                setTimeout(() => {

                    this.rows = [];
                    let accumulative = 0;
                    let accuIndex = 0;

                    for(let col of this.form()) {

                        if (!col.fields) continue;

                        let index = 0;
                        for(let field of col.fields) {

                            let c : any = {
                                width: col.width ? col.width : '100%',
                                field: null
                            }

                            let model : any = {};
                            if (field.model) {
                                model = field.model;
                            } else {
                                model[field.name] = field.value ? field.value : '';
                            }

                            if (copyPreviousValues && field.name) {
                                this.previousValues[field.name] = model[field.name];
                            }

                            const ref = this;

                            let f : {
                                model: any,
                                name: string,
                                props: any,
                                type: string,
                                validate: (value: any) => any|null,
                                error: any,
                                class: string,
                                condition: () => boolean,
                                conditionPlaceholder: string|null,
                                content: () => string | null,
                                component: any | null,
                                required: boolean,
                                change: (value: any) => void,

                                // For file
                                fileSrc: any
                            } = {
                                model: model,
                                name: field.name ? field.name : '',
                                type: field.type ? field.type : 'text',
                                validate: field.validate ? field.validate : null,
                                error: null,
                                props: {},
                                class: field.class ? field.class : '',
                                condition: field.condition ? field.condition : () => true,
                                conditionPlaceholder: field.conditionPlaceholder ? field.conditionPlaceholder : null,
                                content: field.content ? field.content : null,
                                component: field.component ? field.component : null,
                                required: field.required,
                                change(value: any) {

                                    if (field.change) {
                                        field.change(value);
                                    }

                                    let same: boolean = false;
                                    const a = this.model[this.name];
                                    const b = ref.previousValues[this.name];
                                    if (field.comparer) {
                                        same = field.comparer(a, b);
                                    } else {
                                        same = a === b;
                                    }

                                    if (same) {

                                        const index = ref.valuesChanged.indexOf(this.name);

                                        if (index >= 0) {
                                            ref.valuesChanged.splice(index, 1);
                                        }

                                        ref.$emit('change', ref.valuesChanged.length > 0);

                                    } else {

                                        if (!ref.valuesChanged.includes(this.name)) {
                                            ref.valuesChanged.push(this.name);
                                        }

                                        ref.$emit('change', true);

                                    }
                                },

                                // For file
                                fileSrc: field.src ? field.src : null
                            }

                            Object.keys(field)
                            .forEach((k: string) => {
                                if (['name', 'value', 'model', 'validate', 'condition', 'class', 'content', 'conditionPlaceholder'].includes(k)) {
                                    return;
                                }

                                if (k == 'componentProps'){
                                    Object.keys(field.componentProps)
                                    .forEach((k: string) => {
                                        f.props[k] = field.componentProps[k];
                                    })
                                    return;
                                }  

                                f.props[k] = field[k];
                            });

                            c.field = f;

                            accumulative = Number( c.width.replace('%', '') );
                            if (accumulative >= 100) {
                                if (accumulative > 100)
                                    accumulative -= 100;
                                accuIndex = this.rows.length;
                                index = 0;
                            }

                            const rowIndex = accuIndex + index;

                            if (this.rows.length > rowIndex) {
                                this.rows[rowIndex].push(c);
                            } else {
                                this.rows.push([c]);
                            }
        
                            ++ index;

                        }

                    }

                    // Fix rows
                    let aux = this.rows;
                    this.rows = [[]];

                    for(let row of aux) {
                        for(let col of row) {
                            this.rows[0].push(col);
                        }
                    }

                    resolve(true);

                }, inmediate ? 0 : 5);

            });

        },

        displayConditionPlaceholder(col: any) {
            if (!col.field) return false;

            let f : any = col.field;
            if (!f.conditionPlaceholder) return false;
            if (!f.condition) return false;
            if (f.condition()) return false;

            return true;
        },

        getConditionPlaceholder(col: any) {
            let p : any = col.field.conditionPlaceholder;

            if (typeof p == 'string') return p;
            return '';
        },

        valueChanged(field: any) {
            field.error = null;
            field.change();
        },

        updateModel() {

            if (!this.rows) return;

            let models: any = {}
            for(let col of this.form()) {
                if (!col.fields) continue;

                for(let field of col.fields) {
                    if (!field.model) continue;

                    models[field.name] = field.model;
                }
            }

            for(let row of this.rows) {
                for(let col of row) {
                    if (!models[col.field.name]) continue;

                    const model = models[col.field.name];

                    if (model != col.field.model) {
                        col.field.model = model;
                    }
                }
            }
            
            this.$forceUpdate();

        },

        $t(key: string) {
            return translate.get(key);
        },

        classForColumn(col: any) {
            
            if (!col.width) return {}
            if (!col.width.includes('%')) return {}

            let number = col.width.replace('%', '');
            let cl = 'col-sm-' + number + '-p';

            let obj : any = {}
            obj[cl] = true;
            return obj;

        },

        classForField(field: any) {
            let obj : any = {}
            if (field.class) {
                obj[field.class] = true;
            }
            return obj;
        },

        checkErrors() {

            for(let row of this.rows!) {
                for(let col of row) {

                    const val = col.field.model[col.field.name];

                    if (!col.field.error) continue;
                    col.field.error = null;

                    if (!col.field.validate) {
                        if (col.field.required && !val) {
                            col.field.error = translate.get('forms.errors.required');
                        }

                        else if (col.field.type == 'email' && 
                            !Validator.for(val)
                            .isEmail()
                            .validate()) {

                            col.field.error = translate.get('forms.errors.email');
                        }

                        continue;
                    }

                    let res = col.field.validate(val);
                    if (res) {
                        col.field.error = res;
                    }
                }
            }

            this.$forceUpdate();
        },

        validate(all: boolean = false) {

            let someError : boolean = false;

            for(let row of this.rows!) {
                for(let col of row) {

                    const val = col.field.model[col.field.name];

                    col.field.error = null;

                    if (!col.field.validate) {
                        if (col.field.required && !val) {
                            someError = true;
                            col.field.error = translate.get('forms.errors.required');
                        }

                        else if (col.field.type == 'email' && 
                            !Validator.for(val)
                            .isEmail()
                            .validate()) {

                            someError = true;
                            col.field.error = translate.get('forms.errors.email');
                        }

                        if (someError && !all) {
                            this.$forceUpdate();
                            return false;
                        }

                        continue;
                    }

                    let res = col.field.validate(val);
                    if (res) {
                        col.field.error = res;
                        someError = true;
                        if (!all) {
                            this.$forceUpdate();
                            return false;
                        }
                    }
                }
            }

            this.$forceUpdate();
            return !someError;
        },

        fileSelected(field: any, file: any) {
            let f = file.length > 0 ? file[0] : null;
            if (f) {
                field.model[field.name] = f;
                Utils.fileToSrc(f)
                .then((src: any) => {
                    field.fileSrc = src;
                });
            } else {
                field.fileSrc = null;
            }
        },

        gather() {
            if (!this.form) return {};

            let data: any = {}

            for(let row of this.rows!) {

                for(let col of row) {

                    if (!col.field) continue;

                    if (!col.field.name) continue;

                    data[col.field.name] = col.field.model[col.field.name];

                }
            }

            return data;
        },

        undo() {
            for(let col of this.form()) {
                if (!col.fields) continue;

                for(let field of col.fields) {
                    if (!field.model) continue;
                    if (!this.previousValues[field.name]) continue;

                    field.model[field.name] = this.previousValues[field.name];
                }
            }
            this.$forceUpdate();
        }

    },

    watch: {
        $props: {
            handler() {
                if (!this.rows)
                    this.initialize()
                else
                    this.updateModel();
            },
            deep: true,
            immediate: true
        }
    },

});