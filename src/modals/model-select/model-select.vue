<template>
    <div id="model-select-modal">
        
        <div class="flex-row">
            <div class="flex-row select" @click="submit()">
                <div>{{ $t('generic.select') }}
                    <span v-if="multiple">({{selecteds.length}})</span>
                </div>
            </div>
            <div class="flex-grow" />
            <svg-icon class="close" name="x" source="heroicons-solid" @click="close()"/>
        </div>

        <search-bar v-model="modelName" v-if="searchbar" @write="resetSearch()"/>

        <infinite-scroll :list="items" :onLoadMore="doSearch" :emptyMessage="emptyMessage" ref="scroller">
            <div class="model-item" v-for="(it, index) in items" :key="index" @click="select(it)" :class="{active: isSelected(it)}">

                <svg-icon class="checked" name="check" source="heroicons-solid" />

                <div class="simple-item" v-if="item(it).content" v-html="item(it).content"/>

                <component v-if="item(it).component" :is="item(it).component" v-bind="item(it).props" />
            </div>
        </infinite-scroll>
    </div>
</template>

<script lang="ts" src="./model-select.ts"></script>
<style lang="scss" src="./model-select.scss"></style>