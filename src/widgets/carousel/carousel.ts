import Vue from 'vue';

export default Vue.extend({
   
    components: { },

    props: ['perSlide', 
        'items',
        'auto',
        'autoDelay',
        'interval', 
        'transition'
    ],

    data() {
        let data : {
            responsiveConfig: number[][],
            windowSize: number,
            containerWidth: number,
            elementWidth: number,
            slides: any[][],
            currentPage: number,
            autoInterval: any
        } = {
            responsiveConfig: [
                [0, 1], //
                [535, 1], // xs
                [768, 2], // sm
                [992, 4], // md
                [5000, 6] // lg
            ],
            windowSize: 0,
            containerWidth: 0,
            elementWidth: 0,
            slides: [],
            currentPage: 0,
            autoInterval: null
        }

        return data;
    },

    created() {

        if (this.perSlide) {

            if (typeof this.perSlide == 'object') {

                let sizes : any = {
                    col: 0,
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 4
                }

                Object.keys(sizes).forEach((size: string) => {
                    if (this.perSlide[size]) {
                        this.responsiveConfig[ sizes[size] ][1] = this.perSlide[size];
                    }
                });

            }

        }

        window.addEventListener("resize", this.onScreenSizeChange);

    },

    destroyed() {
        window.removeEventListener("resize", this.onScreenSizeChange);
    },

    mounted() {
        this.onScreenSizeChange();

        if (this.auto) {
            this.setupInterval();
        }
    },

    methods: {

        onScreenSizeChange() {
            this.windowSize = window.innerWidth;
            this.containerWidth = (this.$refs.container as any).clientWidth;

            let perSlide = 1;
            for(let size of this.responsiveConfig) {
                if (this.windowSize > size[0]) {
                    perSlide = size[1];
                } else break;
            }

            this.elementWidth = this.containerWidth / perSlide;

            if (!this.items) return;

            let slides = [];
            let slide = [];
            for(let item of this.items) {
                slide.push(item);
                if (slide.length >= perSlide) {
                    slides.push(slide);
                    slide = [];
                }
            }
            if (slide.length > 0) slides.push(slide);

            this.slides = slides;
        },

        setupInterval() {

            let seti = () => {
                this.autoInterval = setInterval(() => {
                    this.nextPage();
                }, this.interval ? this.interval : 3000);
            }

            if (!this.autoInterval) {
                if (!this.autoDelay) {
                    seti();
                } else {
                    setTimeout(() => {
                        seti();
                    }, this.autoDelay);
                }
            } else {
                clearInterval(this.autoInterval);
                seti();
            }
        },

        prevPage() {

            if (this.autoInterval) {
                this.setupInterval();
            }

            if (this.currentPage > 0) {
                this.currentPage -= 1;
            } else {
                this.currentPage = this.slides.length - 1;
            }
        },

        nextPage(resetInterval = false) {

            if (resetInterval && this.autoInterval) {
                this.setupInterval();
            }

            if (this.currentPage < this.slides.length - 1) {
                this.currentPage += 1;
            } else {
                this.currentPage = 0;
            }
        }
    }

});