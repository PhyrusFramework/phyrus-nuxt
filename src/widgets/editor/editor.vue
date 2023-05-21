<template>
    <vue-editor v-model="content"
    ref="editor"
    @text-change="emit($event)" 
    @image-added="emit()" 
    @image-removed="emit()"
    @focus="passEmit('focus', $event)"
    @blur="passEmit('blur', $event)"
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