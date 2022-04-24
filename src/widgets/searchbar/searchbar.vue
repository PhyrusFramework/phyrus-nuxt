<template>
    <div class="searchbar">
        <svg-icon name="search" @click="search()"/>

        <input :placeholder="placeholder ? placeholder : $t('generic.search')" 
        @keyup.enter="search()"
        v-bind:value="value"
        v-on:input="onInput($event.target.value)"
        @blur="doBlur($event)"
        @focus="doFocus($event)">

        <div class="suggestions" v-if="suggestions && suggestions.length > 0">
            <div class="suggestion" v-for="suggestion of suggestions" :key="suggestion"
            @click="selectSuggestion(suggestion)">
                {{suggestion}}
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./searchbar.scss"></style>
<script lang="ts" src="./searchbar.ts"></script>