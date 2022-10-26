import Vue from 'vue';
import SearchBar from '../searchbar/searchbar';

export default Vue.extend({

  components: { SearchBar },

  props: ['options', 
  'placeholder', 
  'value', 
  'inverted', 
  'onChange', 
  'disabled', 
  'comparer', 
  'component', 
  'props', 
  'beforeChange', 
  'clearx'],

  data() {

    let data : {
      open: boolean,
      selected: any,
      search: string,
      mouseOnSearch: boolean,
      openDisabled: boolean
    } = {
      open: false,
      selected: null,
      search: '',
      mouseOnSearch: false,
      openDisabled: false
    }

    return data
  },

  created() {
    this.setDefault();

    document.body.addEventListener('click', () => {
        if (!this.open) return;
        if (this.mouseOnSearch) return;

        setTimeout(() => {
            this.open = false;
        }, 50);
    }, true);

    document.body.addEventListener('keypress', ($e) => {
      if (this.open) {
        this.$emit('key', {key: $e.key, code: $e.keyCode, e: this});
      }
    });

  },

  methods: {

    scrollTo(pos: number) {
      (this.$refs.dropdown as any).scrollTop = pos;
    },

    getOptions() {
      return Array.isArray(this.options) ? this.options : this.options();
    },

    select(option: any) {

      const end = () => {
        this.selected = (option.value === null) ? null : option;
        this.open = false;
  
        this.$emit('input', option.value);
        this.$emit('change', option.value);
  
        if (this.onChange) {
          this.onChange(option.value);
        }
  
        this.$forceUpdate();
      }

      if (!this.beforeChange) end();
      else {
        this.beforeChange(option.value)
        .then(end)
        .catch(() => {});
      }

      if (this.search != '') {
        this.search = '';
        this.$emit('search', this.search);
      }

    },

    clearValue() {
      this.openDisabled = true;
      this.select({value: null});
      setTimeout(() => {
        this.openDisabled = false;
      }, 20);
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
  },

  watch: {
    $props: {
    handler() {
        this.selected = null;
        this.setDefault();
    },
    deep: true,
    immediate: true,
    },
  },

})