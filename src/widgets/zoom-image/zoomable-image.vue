<template>
    <div class="zoomable-image">
        <img :src="url" @click="zoom()">
    </div>
</template>

<script lang="ts" src="./zoomable-image.ts" />
<style>
.zoomable-image img {
    width: 100%;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 2px 2px 2px rgba(0,0,0, .3);
}
</style>