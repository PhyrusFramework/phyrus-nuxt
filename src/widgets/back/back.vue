<template>
    <svg-icon class="back" name="heroicons-solid/chevron-left" source="heroicons-solid" :style="getStyle()" @click="doClick()"/>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: ['size'],

    methods: {
        getStyle() {
            let s = this.size ? this.size : 30;

            return {
                width: s + 'px',
                height: s + 'px',
                cursor: 'pointer'
            }
        },
        doClick() {
            this.$emit('click');
        }
    }
});
</script>