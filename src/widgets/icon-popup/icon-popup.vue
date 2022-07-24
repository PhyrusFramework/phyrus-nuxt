<template>
    <div class="icon-popup">
        <div class="icon">
            <svg-icon :name="icon ? icon : 'awesome/bell'" @click="toggle()"/>

            <div class="badge" v-if="badge">{{ badge }}</div>

            <div class="popup" :style="{opacity: opacity}"
            :class="{open: open, right: side === 'right'}"
            @click="preventClose()">

                <div v-if="content" class="content-html" v-html="content"/>
                <component v-if="component" :is="component" v-bind="getProps()"/>
                <slot />
                
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./icon-popup.ts"></script>
<style lang="scss" src="./icon-popup.scss"></style>