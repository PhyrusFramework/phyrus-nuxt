<template>
    <svg-icon name="x" source="heroicons-solid" :style="getStyle()" @click="doClick()"/>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: ['size'],

    methods: {
        getStyle() {
            let s = this.size ? this.size : 20;

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