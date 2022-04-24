<template>
    <div class="tooltip">
        <slot />
        <div class="tooltip-message">{{text}}</div>
    </div>
</template>

<script lang="ts" src="./tooltip.ts"></script>
<style lang="scss">
.tooltip {
    position: relative;

    .tooltip-message {
        position: absolute;
        z-index: 99;
        opacity: 0;
        pointer-events: none;
        transition: opacity .3s;
        background-color: #4e4e4e;
        color: white;
        padding: 5px;
        border-radius: 5px;

        bottom: 100%;
        left: 0;
        font-size: 12px;
        text-transform: none;
        width: max-content;
        max-width: 250px;
        user-select: none;
    }

    &:hover {
        .tooltip-message {
            opacity: 1;
        }
    }
}
</style>