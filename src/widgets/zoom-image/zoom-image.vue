<template>
    <div class="zoom-image custom-scrollbar" v-if="displayed">
        <svg-icon name="x" @click="close()"/>

        <img :src="url" :class="{zoomed: zoomed}" @click="zoomed = !zoomed">
    </div>
</template>

<script lang="ts" src="./zoom-image.ts"></script>
<style lang="scss" src="./zoom-image.scss"></style>