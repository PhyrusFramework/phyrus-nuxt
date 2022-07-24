<template>
    <div class="calendar">
        <div class="month flex-row">
            <svg-icon name="heroicons-solid/chevron-left" @click="prevMonth()" />

            <div class="flex-grow">
                {{ title() }}
            </div>

            <svg-icon name="heroicons-solid/chevron-right" @click="nextMonth()" />
        </div>

        <div class="table">
            <div class="calendar-table-row row" v-for="(row, index) in table" :key="index">
                <div class="cell" v-for="(day, index2) in row" :key="index2"
                :class="classForCell(day)"
                @click="select(day)" @mouseenter="setHovered(day)" @mouseleave="setHovered(null)">
                    {{day.number}}
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./calendar.scss"></style>
<script lang="ts" src="./calendar.ts"></script>