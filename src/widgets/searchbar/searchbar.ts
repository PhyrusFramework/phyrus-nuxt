import Vue from 'vue';
import translate from '../../modules/translator';

export default Vue.extend({
  components: { },

  props: ['placeholder', 'stopTime', 'onWrite', 'onStopWriting', 'onSearch', 'value'],

  data() {

    let data : {
      suggestions: string[]|null,
      lastWrite: number
    } = {
      suggestions: null,
      lastWrite: -1
    }

    return data;
  },

  methods: {
      $t(key: string, parameters: any = {}) {
        return translate.get(key, parameters);
      },
      onInput(val: string) {

        this.$emit('input', val);
        this.$emit('write', this);
        this.$emit('change', val);

        if (this.onWrite) {
          this.onWrite(this);
        }

        this.lastWrite = Date.now();

        let millis = (this.stopTime ? this.stopTime : 0.5) * 1000;

        setTimeout(() => {

          if (Date.now() - this.lastWrite >= millis) {
            this.$emit('stop', this);

            if (this.onStopWriting) {
              this.onStopWriting();
            }
          }

        }, millis);

      },
      setSuggestions(suggestions: string[]) {
        this.suggestions = suggestions;
      },
      selectSuggestion(suggestion: string) {
        this.$emit('input', suggestion);
        this.$emit('suggestionSelected', suggestion);
        this.suggestions = null;
      },
      search() {
        this.$emit('search', this);

        if (this.onSearch) {
          this.onSearch(this);
        }
      },
      clear() {
        this.suggestions = null;
        this.$emit('input', '');
      },

      doBlur($event: any) {
        setTimeout(() => {
          this.suggestions = null;
          this.$emit('blur', $event);
        }, 100);
      },

      doFocus($event: any) {
        this.$emit('focus', $event);
      }
  }
})