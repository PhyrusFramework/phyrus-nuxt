import Vue from 'vue';
import App from '../../modules/app';

export default Vue.extend({

  components: { },

  props: ['url', 'zoomUrl'],

  methods: {
      zoom() {
        App.zoomedImage.open(this.zoomUrl ? this.zoomUrl : this.url);
      }
  }

})