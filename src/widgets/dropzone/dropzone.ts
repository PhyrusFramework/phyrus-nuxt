import Vue from 'vue';

export default Vue.extend({

    props: ['onDrop', 
    'clickable', 
    'multiple', 
    'maxSize', 
    'onSizeExceeded', 
    'accept', 
    'disabled' ],

    methods: {
        triggerInput() {
            if (this.disabled) return;
            if (!this.clickable) return;
            (this.$refs.inputFile! as any).click();
        },

        dropped($e: any) {
            $e.preventDefault();
            if (this.disabled) return;

            let files : any[] = [];
            for(let i = 0; i < $e.dataTransfer.items.length; ++i) {
                var file = $e.dataTransfer.items[i].getAsFile();

                if (this.accept) {
                    let type = file.type;

                    const formats = this.accept.split(',').map((x: string) => x.trim());
                    let allowed = formats.includes(type) || formats.includes(type.split('/')[0] + '/*');
                    if (!allowed) continue;
                }

                files.push(file);
            }

            this.onfiles(files);
        },

        fileSelected($e: any) {
            let files = $e.target.files;

            this.onfiles(files);
        },

        onfiles(files: any[]) {
            if (this.onDrop)
                this.onDrop(files);

            if (this.maxSize) {
                for(let file of files) {
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

            this.$emit('input', files.length > 0 ? files[0] : null);
            this.$emit('drop', files);
            this.$emit('change', files);
            (this.$refs.inputFile as any).value = '';
        },

        clear() {
            (this.$refs.inputFile as any).value = '';
            this.$emit('input', null);
            this.$emit('change', []);
        }
    }
});