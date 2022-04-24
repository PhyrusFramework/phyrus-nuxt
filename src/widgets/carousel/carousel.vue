<template>
    <div class="carousel" ref="container">

        <div class="carousel-control prev" @click="prevPage()" v-show="currentPage > 0">
            <svg-icon name="chevron-left"/>
        </div>

        <div class="carousel-inner">

            <div class="carousel-items" v-if="items" :style="{
                'margin-left': '-' + (containerWidth * currentPage) + 'px',
                'transition': 'margin ' + (transition ? transition + 's' : '.5s')
            }">

                <div class="carousel-slide"
                v-for="(slide, index) in slides" :key="index">

                    <div class="carousel-item"
                    :style="{
                        width: elementWidth + 'px'
                    }"
                    v-for="(item, index) in slide" :key="index" >

                        <slot v-bind:item="item"/>

                    </div>

                </div>

            </div>

        </div>

        <div class="carousel-control next" @click="nextPage(true)" v-show="currentPage < slides.length - 1">
            <svg-icon name="chevron-right"/>
        </div>

    </div>
</template>

<style lang="scss" src="./carousel.scss"></style>
<script lang="ts" src="./carousel.ts"></script>