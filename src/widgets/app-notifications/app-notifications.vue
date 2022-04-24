<template>
    <div class="app-notifications">
        <div v-for="(notification, index) in notifications" :key="index" 
        class="notification"
        :class="classForElement(notification)">
            
            <div class="type-icon" v-if="notification.icon">
                <svg-icon :name="notification.icon"/>
            </div>

            <div class="message" v-if="notification.message">
                {{notification.message}}
            </div>

            <component v-if="notification.component" :is="notification.component" v-bind="notification.props"/>

            <svg-icon class="close" name="x" @click="closeNotification(notification)"/>
        </div>
    </div>
</template>

<script lang="ts" src="./app-notifications.ts"></script>
<style lang="scss" src="./app-notifications.scss"></style>