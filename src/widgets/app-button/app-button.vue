<template>
    <div class="app-button" :class="{disabled: isDisabled(true)}" @click="clickAction()">
        <svg-icon class="icon-left" v-if="!loading && lefticon" v-bind="lefticon"/>
        <div v-if="!loading" class="flex-row">
            <div v-if="content" v-html="content" />
            <slot />
        </div>
        <svg-icon class="icon-right" v-if="!loading && righticon" v-bind="righticon" />

        <loader v-if="loading" :size="18" color="white" backcolor="var(--primary-color)"/>
    </div>
</template>

<style>
.app-button {
    padding: 10px 15px;
    border-radius: var(--rounded);
    background-color: var(--primary-color);
    color: white;
    font-size: 13px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    transition: background .3s;
    box-sizing: content-box;
}
.app-button:hover {
    filter: brightness(0.95);
}
.app-button:active {
    filter: brightness(0.8);
}
.app-button svg {
    width: 20px;
    height: 20px;
}
.app-button .icon-left {
    margin-right: 3px;
}
.app-button .icon-right {
    margin-left: 3px;
}
.app-button .loader-container {
    margin: 0 0;
    padding: 0;
}

.app-button.disabled {
    background-color: lightgray;
    cursor: not-allowed;
}
.app-button.disabled:hover {
    filter: none;
}
</style>
<script lang="ts" src="./app-button.ts"></script>