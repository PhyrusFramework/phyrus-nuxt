<template>
<div class="slider-select" :class="{open: open, inverted: inverted, disabled: disabled}">
    <div class="slider-select-bullet" @click="openDropdown()">
        <div class="slider-select-selected" 
        :class="{'uses-placeholder': !selected}"
        v-html="selected ? (selected.content ? selected.content : selected.value) : (placeholder ? placeholder : '')"></div>
        <svg-icon name="heroicons-solid/chevron-down" class="text-primary" />
    </div>

    <div class="slider-select-dropdown" v-if="options">
        <div class="slider-select-option" v-for="(option, index) in getOptions()" :key="index" 
        v-html="option.content ? option.content : option.value" @click="select(option)"></div>
    </div>
</div>
</template>

<style lang="scss" src="./slider-select.scss"></style>
<script lang="ts" src="./slider-select.ts"></script>