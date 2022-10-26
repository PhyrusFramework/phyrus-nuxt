<template>
    <div class="infinite-scroll custom-scrollbar" @scroll="handleScroll($event)" ref="container"
    :style="{
        'display': reverse ? 'flex' : 'block',
        'flex-direction': reverse ? 'column-reverse' : ''
    }">
        <slot />
        <div class="empty-message" v-if="emptyMessage && list && list.length == 0" v-html="emptyMessage"/>
        <loader v-if="!list || loading" />
        <div ref="mark"></div>
    </div>
</template>

<style lang="scss" src="./infinite-scroll.scss"></style>
<script lang="ts" src="./infinite-scroll.ts"></script>