<template>
    <div class="image-load">

        <div class="img-loader-container flash-effect" v-if="!loaded"
        :style="{
            width: (width ? width+'px' : '100%'),
            height: (height ? height + 'px' : ''),
        }">
            <loader/>
        </div>

        <img :src="src" 
        v-show="loaded" 
        v-if="!error"
        @load="loaded = true" 
        @error="imgError()"
        :style="{position: loaded ? 'relative' : 'absolute'}">

        <img v-if="error && placeholder" :src="placeholder" >
    </div>
</template>

<script lang="ts" src="./image.ts"></script>
<style lang="scss" src="./image.scss"></style>