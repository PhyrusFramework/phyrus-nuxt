<template>
    <div class="dots-menu-button" :class="{open: open, 
    'background-effect': background !== false && background != 'false',
    'effect-grow': !effect || effect == 'grow',
    'effect-slide': effect == 'slide'}">
        <svg-icon
            @click="openMenu()"
            :name="effect == 'slide' ? 'heroicons-solid/chevron-down' : 'heroicons-solid/dots-horizontal'"
            :class="{'text-gray': !color, 'text-primary': color}"
            class="toggle w-6 h-6 justify-self-end group-hover:text-primary"
            :style="btnStyle"/>

        <div class="dots-float-menu" v-if="options">
            <div class="dots-menu-option" v-for="(option, index) in options" :key="index"
            @click="selectOption(option)">
                <svg-icon v-if="option.icon" :name="option.icon" class="text-gray"/>
                <div>{{option.label}}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./dots-menu.ts"></script>
<style lang="scss" src="./dots-menu.scss"></style>