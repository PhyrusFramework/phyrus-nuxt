import Vue from 'vue';

export default Vue.extend({
  components: { },

  props: ['options', 'placeholder', 'value', 'inverted', 'onChange', 'disabled', 'separator', 'comparer'],

  data() {

    let data : {
      open: boolean,
      autoClose: boolean
    } = {
      open: false,
      autoClose: true
    }

    return data
  },

  created() {
    document.body.addEventListener('click', () => {
      
        setTimeout(() => {

          if (!this.open) return;
          if (!this.autoClose) return;
  
          setTimeout(() => {
              this.open = false;
          }, 50);

        }, 5);

    }, true); 
  },

  methods: {
    select(option: any) {

      this.autoClose = false;
      
      let index = this.findPosition(option.value);
      if (index >= 0) {
        this.value.splice(index, 1);
      } else {
        this.value.push(option.value);
      }

      this.$emit('input', this.value);
      this.$emit('change', this.value);

      if (this.onChange) {
        this.onChange(this.value);
      }

      setTimeout(() => {
        this.autoClose = true;
      }, 5);
    },

    openDropdown() {
      if (this.disabled) return;
      setTimeout(() => {
        this.open = !this.open;
      }, 10);
    },

    isSelected(option: any) {
      if (this.comparer) {
        for(let item of this.value) {
          if (this.comparer(item, option.value))
            return true;
        }
      }

      if (this.value.indexOf(option.value) >= 0) {
        return true;
      }
      return false;
    },

    findPosition(val: any) {
      for(let i = 0; i < this.value.length; ++i) {
        let item = this.value[i];

        if (this.comparer) {
          if (this.comparer(item, val)) {
            return i;
          }
        } else {
          if (item == val) {
            return i;
          }
        }
      }
      return -1;
    },

    findOption(item: any) {
      for(let op of this.options) {
        if (this.comparer) {
          if (this.comparer(op.value, item)) {
            return op;
          }
        } else {
          if (op.value == item) {
            return op;
          }
        }
      }
      return null;
    },

    htmlForLabel() {

      let str = '';

      for(let i = 0; i < this.value.length; ++i) {
        let item = this.value[i];

        let op = this.findOption(item);
        if (op != null)
          str += op.label ? op.label : op.content;

        if (this.separator && i < this.value.length - 1) {
          str += this.separator;
        }
      }

      if (str == '') {
        return this.placeholder;
      }

      return str;
    }

  }

})