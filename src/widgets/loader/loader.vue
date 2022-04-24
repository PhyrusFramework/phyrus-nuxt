<template>
    <div class="loader-container">
        <div class="loader" :style="generateStyle()"></div>
    </div>
</template>

<style>
.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px 0;
}

.loader {
  border: 3px solid lightgray;
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<script>
import Vue from 'vue';

export default Vue.extend({

    props: [ 'size', 'color', 'backcolor' ],

    methods: {
      generateStyle() {
        let st = {}

        if (this.size) {
          st['width'] = this.size + 'px';
          st['height'] = this.size + 'px';

          st['border-width'] = (Math.ceil(this.size / 10)) + 'px';
        }

        if (this.backcolor) {
          st['border-color'] = this.backcolor;
          st['border-top-color'] = this.color ? this.color : 'var(--primary-color)';
        }

        if (this.color) {
          st['border-top-color'] = this.color;
        }

        return st;
      }
    }

})
</script>