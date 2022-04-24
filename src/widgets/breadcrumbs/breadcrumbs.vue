<template>
    <div class="breadcrumbs">
        <div :class="{container: container}">
        <li
        v-for="breadcrumb in breadcrumbs"
        :key="breadcrumb.to"
        :class="{active: breadcrumb.active}">
            <nuxt-link class="hover:text-primary" :to="breadcrumb.to">
            {{ breadcrumb.label }}
            </nuxt-link>
        </li>
        </div>
    </div>
</template>

<script lang="ts" src="./breadcrumbs.ts"></script>
<style lang="scss" src="./breadcrumbs.scss"></style>