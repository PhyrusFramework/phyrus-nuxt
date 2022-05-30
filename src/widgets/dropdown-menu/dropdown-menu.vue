<template>
    <div class="dropdown-menu" :depth="depth ? depth : 0"
    :class="{expanded: expanded}" v-if="item"
    @mouseover="expanded = true"
    @mouseleave="expanded = false">

        <div class="dropdown-item" @click="select(item)">
            <svg-icon v-if="item.icon" :name="item.icon" />
            <div v-html="item.content ? item.content : item.label"></div>
            <svg-icon v-if="item.items" :name="depth > 0 ? 'heroicons-solid/chevron-right' : 'heroicons-solid/chevron-down'"/>
        </div>

        <div class="dropdown-children" v-if="item.items"
        :style="{
            'transform': depth > 0 ? 'scale(0, 1)' : 'scale(1, 0)',
            'transform-origin': depth > 0 ? 'left center' : 'center top',
            'top': depth > 0 ? '0%' : '100%',
            'left': depth > 0 ? '100%' : '0%',
            'min-width': depth > 0 ? '' : '100%'
        }">

            <dropdown-menu v-for="(it, index) in item.items" :key="index"
            :parent="asParent()" @selected="clickedChild(it)" :onItemSelected="onItemSelected"
            :item="it" :depth="depth ? depth + 1 : 1"/>

        </div>

    </div>
</template>

<script lang="ts" src="./dropdown-menu.ts"></script>
<style lang="scss" src="./dropdown-menu.scss"></style>