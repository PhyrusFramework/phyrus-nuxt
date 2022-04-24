<template>
    <div class="tabbar" v-if="tabs && tabs.length">
        <div class="tab" v-for="tab of tabs" :key="tab.key"
        :class="{active: value == tab.key}"
        @click="selectTab(tab)">{{ tab.label }}</div>

        <div class="bottom-line" />
    </div>
</template>

<script lang="ts" src="./tabbar.ts"></script>
<style lang="scss" src="./tabbar.scss"></style>