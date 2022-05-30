<template>
    <div class="zoom-image custom-scrollbar" v-if="displayed">
        <svg-icon name="heroicons-solid/x" @click="close()"/>

        <img :src="url" :class="{zoomed: zoomed}" @click="zoomed = !zoomed">
    </div>
</template>

<script lang="ts" src="./zoom-image.ts"></script>
<style lang="scss" src="./zoom-image.scss"></style>