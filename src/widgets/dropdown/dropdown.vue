<template>
    <div class="dropdown" :class="{expanded: status == 'expanded'}">
        <div class="dropdown-label" @click="toggle()" v-if="label">
            <svg-icon name="chevron-right"/>
            <div v-html="label"/>
        </div>
        <div class="dropdown-label" @click="toggle()" v-if="$slots.label">
            <svg-icon name="chevron-right"/>
            <slot name="label"/>
        </div>

        <div class="dropdown-content" v-if="status != 'closed'">
            <slot/>
        </div>
    </div>
</template>

<script lang="ts" src="./dropdown.ts"></script>
<style lang="scss" src="./dropdown.scss"></style>