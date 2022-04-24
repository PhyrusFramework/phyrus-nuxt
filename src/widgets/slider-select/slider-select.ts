import Vue from 'vue';

export default Vue.extend({
  components: { },

  props: ['options', 'placeholder', 'value', 'inverted', 'onChange', 'disabled', 'comparer'],

  data() {

    let data : {
      open: boolean,
      selected: any
    } = {
      open: false,
      selected: null
    }

    return data
  },

  created() {
    this.setDefault();

    document.body.addEventListener('click', () => {
        if (!this.open) return;

        setTimeout(() => {
            this.open = false;
        }, 50);
    }, true); 
  },

  methods: {

    getOptions() {
      return Array.isArray(this.options) ? this.options : this.options();
    },

    select(option: any) {
      this.selected = (option.value === null) ? null : option;
      this.$emit('input', option.value);
      this.open = false;

      this.$emit('change', option.value);

      if (this.onChange) {
        this.onChange(option.value);
      }
    },

    setDefault() {
      const ops = this.getOptions();

      if (this.value && ops) {
        for(let op of ops) {

          let compare = this.comparer ? this.comparer : (a: any, b: any) => a == b;

          if (compare(op.value, this.value)) {
            this.selected = op;
            this.$emit('input', op.value);
            return;
          }
        }
      }
    },

    openDropdown() {
      if (this.disabled) return;
      this.open = !this.open;
    }
  }

})