import Vue from 'vue';
import { VueEditor } from "vue2-editor";
import Utils from '../../modules/utils';

export default Vue.extend({

    props: ['value', 'mode', 'toolbar'],

    components: { VueEditor },

    data() {
        let data : {
            content: string
        } = {
            content: ''
        }
        return data;
    },

    created() {
        this.setContent(this.value);
    },

    updated() {
        this.setContent(this.value);
    },

    methods: {

        focus() {
            (this.$refs.editor as any).quill.focus();
        },

        plainText() {
            return Utils.stripTags(this.content);
        },

        setContent(text: string) {
            this.content = text;
        },

        emit($event?: any) {
            
            if ($event && $event.ops) {
                for(let e of $event.ops) {
                    if (e.insert) {
                        this.$emit('change', {
                            insert: e.insert,
                            editor: this.$refs.editor ? (this.$refs.editor as any).quill : undefined
                        });
                        break;
                    }
                }
            }

            this.$emit('input', this.content);
        },

        clear() {
            this.content = '';
            this.emit();
        },

        passEmit(event: string, $e: any) {
            this.emit(event, $e);
        },

        getToolbar() {

            if (this.toolbar) {
                return this.toolbar;
            }

            if (this.mode == 'advanced')
            return [
                [{ 'size': ['small', false, 'large', 'huge'] }],

                ['bold', 'italic', 'underline', 'strike'],

                [{ 'align': ''}, { 'align': 'center'}, {'align': 'justify'}, {'align': 'right'}],

                [{ 'color': [] }, { 'background': [] }],

                [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
                
                [ 'link', 'image', 'video', 'formula', 'blockquote', 'code-block' ],
            ];

            if (this.mode == 'basic') {
                return [
                    [ 'bold', 'italic', 'underline', 'strike', 'link', { list: "bullet" }]
                ]
            }

            // Mode = 'simple' || !mode

            return [
                [ 'bold', 'italic', 'underline', 'strike', 'link'],

                [{ 'align': ''}, { 'align': 'center'}, {'align': 'justify'}, {'align': 'right'}],

                [{ list: "ordered" }, { list: "bullet" }, { list: "check" }]

            ]
        }
    }
    
});