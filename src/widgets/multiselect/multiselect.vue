<template>
<div class="multiselect" :class="{open: open, inverted: inverted, disabled: disabled}">
    <div class="multiselect-bullet" @click="openDropdown()">
        <div class="multiselect-selected" v-html="htmlForLabel()"></div>
        <svg-icon name="chevron-down" class="text-primary" />
    </div>

    <div class="multiselect-dropdown" v-if="options">
        <div class="multiselect-option" v-for="(option, index) in options" :key="index" 
        :class="{selected: isSelected(option)}" @click="select(option)">
            <svg-icon v-if="isSelected(option)" name="check" source="heroicons-solid" />
            <div v-html="option.content ? option.content : option.value"></div>
        </div>
    </div>
</div>
</template>

<style lang="scss" src="./multiselect.scss"></style>
<script lang="ts" src="./multiselect.ts"></script>