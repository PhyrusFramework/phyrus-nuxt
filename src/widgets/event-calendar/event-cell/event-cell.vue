<template>
    <div class="cell event-cell"
    :style="{'flex-direction' : direction ? direction : 'column'}">

        <div v-if="(emptyCell || addOnHover) && 
        day.hours[hourname].events.length == 0" class="empty-cell"
        @click="handleEmptyCell()">
            <svg-icon v-if="addOnHover" class="add-icon" name="heroicons-outline/plus-circle"/>
        </div>
        
        <event-box v-for="(event, index) in day.hours[hourname].events" :key="index" :event="event"/>
    </div>
</template>

<style lang="scss" src="./event-cell.scss"></style>
<script lang="ts" src="./event-cell.ts"></script>