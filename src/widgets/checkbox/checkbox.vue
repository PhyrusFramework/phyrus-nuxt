<template>
    <div class="checkbox" :class="{active: value}" @click="onclick()">
        <svg-icon name="heroicons-outline/check"/>
    </div>
</template>

<script lang="ts" src="./checkbox.ts"></script>
<style lang="scss" src="./checkbox.scss"></style>