<template>
<div class="slider-select" :class="{open: open, inverted: inverted, disabled: disabled}">
    <div class="slider-select-bullet" @click="openDropdown()">
        <div class="slider-select-selected" 
        :class="{'uses-placeholder': !selected}">
            <div v-if="!component" v-html="selected ? (selected.content ? selected.content : selected.value) : (placeholder ? placeholder : '')"/>
            <component v-if="component" :is="component" v-bind="props" :option="selected"/>
        </div>
        <svg-icon name="heroicons-solid/chevron-down" class="text-primary" />
    </div>

    <div class="slider-select-dropdown" v-if="options" ref="dropdown">

        <div v-if="$listeners.search" @mouseenter="mouseOnSearch = true" @mouseleave="mouseOnSearch = false">
            <search-bar v-model="search" @stop="$emit('search', search)" />
        </div>

        <div class="slider-select-option" v-for="(option, index) in getOptions()" :key="index" 
        @click="select(option)">
            <div v-if="!component" v-html="option.content ? option.content : option.value"/>
            <component v-if="component" :is="component" v-bind="props" :option="option"/>
        </div>
    </div>
</div>
</template>

<style lang="scss" src="./slider-select.scss"></style>
<script lang="ts" src="./slider-select.ts"></script>