import Vue from 'vue';

export default Vue.extend({

    props: ['onChange', 'getRef', 'value', 'multiple', 'maxSize', 'onSizeExceeded', 'accept', 'disabled'],

    data() {
        let data : {
            files: any[],
            display: boolean
        } = {
            files: [],
            display: true
        }

        return data;
    },

    created() {
        if (this.getRef) {
            this.getRef(this);
        }
    },

    methods: {

        launch() {
            if (this.disabled) return;
            (this.$refs.fileInput as any).click();
        },

        fileSelected($e: any) {

            this.files = $e.target.files;

            if (this.maxSize) {
                for(let file of this.files) {
                    let size = file.size / 1024 / 1024;

                    if (size > this.maxSize) {
                        this.$emit('sizeExceeded', file);
                        if (this.onSizeExceeded) {
                            this.onSizeExceeded(file);
                        }
                        return;
                    }
                }
            }

            if ($e.target.files.length > 0)
                this.$emit('input', $e.target.files[0]);
            else {
                this.$emit('input', null);
            }

            this.$emit('change', $e.target.files);

            if (this.onChange)
                this.onChange($e.target.files);

        },

        getFiles() {
            return this.files;
        },

        clear() {
            (this.$refs.fileInput as any).value = '';
            this.$emit('input', null);
            this.display = false;

            this.$emit('change', []);
            if (this.onChange) {
                this.onChange([]);
            }

            // Clear file selection
            setTimeout(() => {
                this.display = true;
                this.$forceUpdate();
            }, 300);
        }

    }

});