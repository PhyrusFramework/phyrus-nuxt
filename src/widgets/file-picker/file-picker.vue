<template>
    <div class="file-picker" @click="launch()">
        <slot/>
        <input type="file" ref="fileInput" :multiple="multiple" :accept="accept ? accept : '*/*'"
        v-if="display" style="display: none" @change="fileSelected">
    </div>
</template>

<script lang="ts" src="./file-picker.ts"></script>