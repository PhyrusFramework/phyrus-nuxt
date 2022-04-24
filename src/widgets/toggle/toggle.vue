<template>
    <div class="switch toggle" 
    :class="{active: value}"
    :style="toggleStyle()"
    @click="toggle()">
        <div class="switch-separator" />
        <div class="switch-thumb" :style="thumbStyle()"></div>
    </div>
</template>

<script lang="ts" src="./switch.ts"></script>
<style lang="scss" src="./switch.scss"></style>