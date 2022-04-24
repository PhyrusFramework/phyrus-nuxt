<template>
    <div class="video-player">
        <video ref="video" controls>
            <source :src="url" type="video/mp4">
            Video player not supported
        </video>
    </div>
</template>

<script lang="ts" src="./video-player.ts" />
<style lang="scss" src="./video-player.scss" />