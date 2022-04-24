<template>
    <div class="crop-image-modal">
        <cropper @change="cropperChange($event)" v-if="src" :src="src"/>
        <div class="flex-row flex-center controls">
            <app-button class="cancel-button" @click="cancel()">{{ $t('generic.cancel') }}</app-button>
            <app-button class="crop-button" @click="crop()">{{ $t('media.crop') }}</app-button>
        </div>
    </div>
</template>

<style lang="scss" src="./cropper.scss"></style>

<script lang="ts">
import Vue from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import AppButton from '../../widgets/app-button/app-button.vue';
import translate from '../../modules/translator';
import App from '../../modules/app';

export default Vue.extend({
    props: ['src', 'onSave'],
    components: {Cropper, AppButton},

    data() {
        let data : {
            cropped: string
        } = {
            cropped: ''
        }
        return data;
    },

    methods: {
        $t(key: string) {
            return translate.get(key);
        },
        cropperChange($event: any) {
            this.cropped = $event.canvas.toDataURL();
            this.$emit('change', this.cropped);
        },

        cancel() {
            App.modal.close();
        },

        crop() {
            App.modal.close();
            this.$emit('save', this.cropped);
            if (this.onSave) {
                this.onSave(this.cropped);
            }
        }
    }
});
</script>