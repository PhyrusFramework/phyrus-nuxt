<template>
    <div class="animated-list" v-if="list">
        <div class="animated-list-item" v-for="(item, index) in list" :key="index"
        :style="{
            transition: (animated.indexOf(item) >= 0 || animOut.indexOf(item) >= 0) ? 'all ' + (time / 1000) + 's' : '',
            transform: (animated.indexOf(item) >= 0) ? 'scale(0.9)' : 'none',
            opacity: (animated.indexOf(item) >= 0) ? '0' : '1'
        }">
            <slot v-bind:item="item"/>
        </div>
    </div>
</template>

<script lang="ts" src="./animated-list.ts"></script>