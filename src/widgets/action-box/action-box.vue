<template>
    <div class="action-box">
        <div class="title flex-row">
            <div class="flex-grow" v-if="title">{{ title }}</div>
            <div class="label" v-if="label">{{ label }}</div>
        </div>

        <div class="content custom-scrollbar" :style="{'max-height': maxHeight ? maxHeight : '250px'}">

            <slot/>

        </div>

        <div class="footer flex-row" v-if="buttons && buttons.length > 0">
            <div class="flex-grow"></div>
            <app-button 
            v-for="(button, index) in buttons" :key="index"
            :iconleft="button.icon ? button.icon : ''" class="secondary" 
            @click="button.onClick()"
            :disabled="button.disabled && button.disabled()">
                {{ button.text }}
            </app-button>
        </div>
    </div>
</template>

<style lang="scss" src="./action-box.scss"></style>
<script lang="ts" src="./action-box.ts"></script>