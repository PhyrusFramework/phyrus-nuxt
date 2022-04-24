<template>
    <div class="event-box"
        :style="{'border-left': 'solid 3px ' + event.color}"
        :class="{clickable: event.onClick || event.popup}"
        @click="handleClick(event)">

        <div class="mask" :style="{'background-color': event.color}"/>

        <div class="popup" v-if="event.popup && event.popupVisible > 0"
            :class="{full: event.popupVisible == 2}">
            <div v-if="event.popup.content" v-html="event.popup.content()" />
        </div>

        <div class="event-content" :style="{color: event.color}">

            <div class="event-time flex-row">

                <div class="event-actions flex-row">
                    <a class="btn" v-if="event.meet" 
                    :href="event.meet" target="_blank"
                    :style="{background: event.color}">
                        <svg-icon name="heroicons-solid/video-camera"/>
                    </a>

                    <a class="btn" v-if="event.link"
                    :href="event.link" target="_blank"
                    :style="{background: event.color}">
                        <svg-icon name="heroicons-solid/link"/>
                    </a>
                </div>

                <div>{{ event.date.time() }}</div>
            </div>

            <div class="event-label">
                <span>{{ event.text }}</span>
            </div>
        </div>

    </div>
</template>

<style lang="scss" src="./event-box.scss"></style>
<script lang="ts" src="./event-box.ts"></script>