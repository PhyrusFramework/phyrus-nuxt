<template>
    <div>
        <div v-for="(modal, index) in modals" :key="index" class="app-modal"
        :class="classForModal(modal)">
            <div class="app-modal-closer" @click="modal.cancelable ? close($event) : ''"></div>
            <div class="app-modal-box" :style="{width: modal.width ? modal.width : 'auto'}">
                <div class="flex-row" v-if="modal.closex">
                    <div class="flex-grow" />
                    <close-x @click="close($event)"/>
                </div>
                <component v-if="modal.component" :is="modal.component" v-bind="modal.componentProps"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./app-modal.ts"></script>
<style lang="scss" src="./app-modal.scss"></style>