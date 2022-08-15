<template>
    <div class="modal-alert">
        <div class="closer" v-if="!cancelable">
            <svg-icon name="heroicons-solid/x" @click="close()"/>
        </div>

        <div class="flex-grow flex-center flex-col">
            <svg-icon class="heroicons-solid/alert-icon" v-if="icon" :name="icon"/>
            <p v-html="text"/>

            <div class="buttons" v-if="buttonLeft || buttonRight">
                <div class="button-left" v-if="buttonLeft" @click="clickButton(buttonLeft)">
                    {{buttonLeft.text}}
                </div>
                <div class="button-right" v-if="buttonRight" @click="clickButton(buttonRight)">
                    {{buttonRight.text}}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./alert.ts"></script>
<style lang="scss" src="./alert.scss"></style>