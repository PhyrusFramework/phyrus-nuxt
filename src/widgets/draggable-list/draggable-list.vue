<template>
    <draggable class="draggable-list" v-model="value" :group="group ? group : 'myList'" 
    @end="manageDragging($event)">
        <li
            v-for="(item, index) in value"
            :key="index">
            
            <slot v-bind:item="item"/>

        </li>
    </draggable>
</template>

<style lang="scss" src="./draggable-list.scss"></style>
<script lang="ts" src="./draggable-list.ts"></script>