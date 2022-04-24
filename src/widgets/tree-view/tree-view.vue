<template>
    <div class="tree-view" 
    v-if="item.visible !== false"
    :class="{expanded: expanded, active: isSelected()}" 
    :style="{'padding-left': getPadding() + 'px'}">
        
        <div class="tree-view-item flex-row"  v-if="!avoidFirst"
        :style="{'background-color': isSelected() ? (activeColor ? activeColor : 'rgb(240, 255, 249)') : ''}">

            <div class="triangle" v-if="getChildren().length > 0" @click="expanded = !expanded">
                <div />
            </div>

            <slot @click="select()" v-bind:item="item"/>

            <svg-icon name="check" v-if="isSelected()" />
        </div>

        <div class="tree-view-children" v-if="avoidFirst || expanded">
            <tree-view v-for="(child, index) in getChildren()" :key="index" 
            ref="childTree" :paddingPerLevel="paddingPerLevel"
            :item="child" :childrenKey="childrenKey" :depth="depthLevel + 1"
            v-model="value" @change="select(item)" :comparer="comparer">
                <template slot-scope="slot">
                    <slot v-bind:item="slot.item"/>
                </template>
            </tree-view>
        </div>
    </div>
</template>

<script lang="ts" src="./tree-view.ts"></script>
<style lang="scss" src="./tree-view.scss"></style>