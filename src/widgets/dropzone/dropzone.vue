<template>
    <div class="dropzone" @drop="dropped" @dragenter.prevent @dragover.prevent 
    @click="triggerInput" :style="{cursor: clickable ? 'pointer' : 'default'}">
        <slot />
        <input type="file" v-if="clickable" @change="fileSelected" style="display:none" ref="inputFile"
        :multiple="multiple" :accept="accept">
    </div>
</template>

<script lang="ts" src="./dropzone.ts"></script>