import Vue from 'vue';

export default Vue.extend({

    props: [ 'size', 'src' ],

    methods: {
        imageStyle() {

            let style : any = {
                'background-image': "url('"+ this.src +"')"
            };
    
            if (this.size) {
    
                style['width'] = this.size + 'px';
                style['min-width'] = this.size + 'px';
                style['height'] = this.size + 'px';
    
            }
    
            return style;
        }
    }

})