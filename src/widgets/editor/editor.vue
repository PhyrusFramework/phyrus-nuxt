<template>
    <vue-editor v-model="content"
    @text-change="emit()" 
    @image-added="emit()" 
    @image-removed="emit()"
    :editor-toolbar="getToolbar()"/>
</template>

<script lang="ts" src="./editor.ts"></script>
<style>
.quillWrapper {
    background-color: white;
}
.ql-snow .ql-toolbar button, .ql-snow.ql-toolbar button {
    transform: scale(0.8);
}
</style>