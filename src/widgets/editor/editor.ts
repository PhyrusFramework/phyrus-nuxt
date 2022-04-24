import Vue from 'vue';
import { VueEditor } from "vue2-editor";

export default Vue.extend({

    props: ['value', 'mode'],

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

        setContent(text: string) {
            this.content = text;
        },

        emit() {
            this.$emit('input', this.content);
        },

        clear() {
            this.content = '';
            this.emit();
        },

        getToolbar() {

            if (this.mode == 'advanced')
            return [
                [{ 'size': ['small', false, 'large', 'huge'] }],

                ['bold', 'italic', 'underline', 'strike'],

                [{ 'align': ''}, { 'align': 'center'}, {'align': 'justify'}, {'align': 'right'}],

                [{ 'color': [] }, { 'background': [] }],

                [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
                
                [ 'link', 'image', 'video', 'formula', 'blockquote', 'code-block' ],
            ];

            // Mode = 'simple' || !mode

            return [
                [ 'bold', 'italic', 'underline', 'strike', 'link'],

                [{ 'align': ''}, { 'align': 'center'}, {'align': 'justify'}, {'align': 'right'}],

                [{ list: "ordered" }, { list: "bullet" }, { list: "check" }]

            ]
        }
    }
    
});