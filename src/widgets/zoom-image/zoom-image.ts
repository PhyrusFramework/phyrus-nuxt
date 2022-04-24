import Vue from 'vue';

export type ZoomImageInterface = {
    _ref: any,
    setReference: (ref: any) => void,

    open: (url: string) => void,
    close: () => void
}

export default Vue.extend({

  data() {

    let data : {
        displayed: boolean,
        url: string|null,
        zoomed: boolean
    } = {
        displayed: false,
        url: null,
        zoomed: false
    }

    return data
  },

  methods: {
      close() {
          this.zoomed = false;
          this.displayed = false;
      },
      open(url: string) {
          this.url = url;
          this.displayed = true;
      }
  }

})