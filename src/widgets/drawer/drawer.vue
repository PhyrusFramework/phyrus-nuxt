<template>
    <div class="drawer-container" v-if="isOpening || isOpen" :class="{open: isOpen, opening: isOpening}">
        <div class="drawer-background"></div>
        <div class="drawer-box" :style="{'max-width': maxWidth}">
            <div class="drawer-header">
                <div>{{title}}</div>
                <svg-icon name="x" @click="closeButton()" />
            </div>

            <div class="drawer-component">
                <component :is="component" v-bind="componentProps" ref="componentRef"/>
            </div>

            <div class="drawer-footer flex-row" v-if="buttonLeft || buttonRight">

                <app-button v-if="buttonLeft" 
                @click="footerButtonClick(buttonLeft)" :lefticon="buttonLeft.icon ? buttonLeft.icon : ''"
                :style="{'background-color': footerButtonColor(buttonLeft)}">
                    {{ buttonLeft.text }}
                </app-button>

                <div class="flex-grow"></div>

                <app-button v-if="buttonRight"
                @click="footerButtonClick(buttonRight)" :lefticon="buttonRight.icon ? buttonRight.icon : ''"
                :style="{'background-color': footerButtonColor(buttonRight)}">
                    {{ buttonRight.text }}
                </app-button>

            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./drawer.ts"></script>
<style lang="scss" src="./drawer.scss"></style>