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
            cols: any[]|null
        } = {
            cols: null
        }
        return data;
    },

    created() {
        this.initialize();
    },

    methods: {

        initialize() {
            this.cols = [];

            for(let col of this.form()) {

                if (!col.fields) continue;

                let c : any = {
                    width: col.width ? col.width : '100%',
                    fields: []
                }

                for(let field of col.fields) {

                    let model : any = {};
                    if (field.model) {
                        model = field.model;
                    } else {
                        model[field.name] = field.value ? field.value : '';
                    }

                    let f : {
                        name: string,
                        props: any,
                        type: string,
                        model: any,
                        validate: (value: any) => any|null,
                        error: any,
                        class: string,
                        condition: () => boolean,
                        content: () => string | null,
                        component: any | null,
                        required: boolean,

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
                        content: field.content ? field.content : null,
                        component: field.component ? field.component : null,
                        required: field.required ? true : false,

                        // For file
                        fileSrc: field.src ? field.src : null
                    }

                    Object.keys(field)
                    .forEach((k: string) => {
                        if (['name', 'value', 'model', 'validate', 'condition', 'class', 'content', 'component'].includes(k)) {
                            return;
                        }

                        f.props[k] = field[k];
                    });

                    if (field.props) {
                        Object.keys(field.props)
                        .forEach((k: string) => {
                            f.props[k] = field.props[k];
                        });
                    }

                    c.fields.push(f);

                }

                this.cols!.push(c);
            }

        },

        updateModel() {

            if (!this.cols) return;

            let models: any = {}
            for(let col of this.form()) {
                if (!col.fields) continue;

                for(let field of col.fields) {
                    if (!field.model) continue;

                    models[field.name] = field.model;
                }
            }

            for(let col of this.cols) {
                for(let field of col.fields) {
                    if (!models[field.name]) continue;

                    const model = models[field.name];

                    if (model != field.model) {
                        field.model = model;
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

        validate(all: boolean = false) {

            let someError : boolean = false;

            for(let col of this.cols!) {
                for(let field of col.fields) {
                    const val = field.model[field.name];

                    field.error = null;

                    if (field.condition) {
                        if (!field.condition()) {
                            continue;
                        }
                    }

                    if (!field.validate) {
                        if (field.required && !val) {
                            someError = true;
                            field.error = translate.get('forms.errors.required');
                        }

                        else if (field.type == 'email' && 
                            !Validator.for(val)
                            .isEmail()
                            .validate()) {

                            someError = true;
                            field.error = translate.get('forms.errors.email');
                        }

                        if (someError && !all) {
                            this.$forceUpdate();
                            return false;
                        }

                        continue;
                    }

                    let res = field.validate(val);
                    if (res) {
                        field.error = res;
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

            for(let col of this.cols!) {

                if (!col.fields) continue;

                for(let field of col.fields) {

                    if (!field.name) continue;

                    data[field.name] = field.model[field.name];

                }
            }

            return data;
        },

        getColumnFields(col: any) {
            const fields: any[] = []
            if (!col)  return fields;

            for(let field of col.fields) {
                if (!field.condition) {
                    fields.push(field);
                } else {
                    if (field.condition()) {
                        fields.push(field);
                    }
                }
            }
            return fields
        }

    },

    watch: {
        $props: {
            handler() {
                if (!this.cols)
                    this.initialize()
                else
                    this.updateModel();
            },
            deep: true,
            immediate: true
        }
    }

});