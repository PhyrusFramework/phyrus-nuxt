<template>
    <div class="event-calendar"
    :class="'mode-' + (mode ? mode : 'week')">

        <div class="header" v-if="mode == 'day'">
            {{ dayTitle() }}
        </div>

        <div class="header" v-if="mode == 'month'">
            {{ monthTitle() }}
        </div>

        <div v-if="(!mode || mode == 'week') && getWeekDays()">

            <div class="row">
                <div class="col-auto cell"/>

                <div class="col cell"
                v-for="(day, name) in getWeekDays()" :key="name">
                    <div class="day-name">{{ day.time.dayName() }}</div>
                    <div class="day-number">{{ day.time.format('DD') }}</div>
                </div>
            </div>

            <div class="row" v-for="(hour, hourname) in getDisplayHours()" :key="hourname">

                <div class="col-auto cell hour-cell">
                    <span>{{ hour.number }}:00</span>
                </div>

                <event-cell class="col"
                v-for="(day, dayindex) in getWeekDays()"
                :key="dayindex"
                :day="day"
                :emptyCell="emptyCell"
                :addOnHover="addOnHover"
                :hour="hour"
                :hourname="hourname"
                direction="column" />

            </div>
        
        </div>

        <div v-if="mode == 'day' && getDay()">

            <div class="row" v-for="(hour, hourname) in getDisplayHours()" :key="hourname">

                <div class="col-auto cell hour-cell">
                    <span>{{ hour.number }}:00</span>
                </div>

                <event-cell class="col"
                :day="getDay()"
                :emptyCell="emptyCell"
                :addOnHover="addOnHover"
                :hour="hour"
                :hourname="hourname"
                direction="row" />

            </div>

        </div>

        <div v-if="mode == 'month'">

            <div class="row">

                <div class="col-7 cell month-day day-name" v-for="(dayname, index) in daynames()" :key="index">
                    {{dayname}}
                </div>

                <div class="col-7 cell month-day"
                v-for="(day, index) in getMonthDays()" :key="index"
                :class="{outer: !day.same}">
                    <span class="day-tag">{{ day.dayNumber }}</span>

                    <event-box v-for="(ev, index) in day.events" :key="index" :event="ev"/>
                </div>

            </div>

        </div>

    </div>
</template>

<script lang="ts" src="./event-calendar.ts"></script>
<style lang="scss" src="./event-calendar.scss"></style>