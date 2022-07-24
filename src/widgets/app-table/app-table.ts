import Vue from 'vue';
import DotsMenu from "../dots-menu/dots-menu.vue";
import Loader from '../loader/loader.vue';
import FormInput from '../form-input/form-input.vue'
import translate from '../../modules/translator';
import DraggableList from '../draggable-list/draggable-list.vue';
import { Table } from './builder';

export default Vue.extend({

  props: {
    table: {
      type: Object as () => Table
    },
    attachScroll: {
      type: Function
    }
  },

  components: { DotsMenu, Loader, FormInput, DraggableList },

  data: () => {
    let data : {
      reloading: boolean,
      currentScrollPosition: number
    } = {
      reloading: false,
      currentScrollPosition: 0
    }

    return data;
  },

  methods: {

    $t(key: string, parameters?: any) {
      return translate.get(key, parameters);
    },

    initializeTable() {
      this.table._ref = this;
      this.$forceUpdate();
    },

    refreshData(refresh?: boolean) {

      if (refresh) {
        this.reloading = true;
      }

      let filters: any = {
        order: this.table.order,
        pagination: this.table.pagination
      }

      Object.keys(this.table.filters)
      .forEach((key: string) => {
        filters[key] = this.table.filters[key];
      });

      this.table.loadData(filters)
      .then((data: any[]) => {
        this.reloading = false;
        this.table.items = data;

        setTimeout(() => {
          this.setScrollers();
        }, 100);
      });

    },

    setScrollPosition(e: Event, a: any = null, b: any = null) {

      const el = (e.target as Element);
      let pos = el.scrollLeft;

      if (pos == this.currentScrollPosition) {
        return;
      }

      this.currentScrollPosition = pos;

      let scrollTop = a !== null ? a : document.getElementById('scrollTop');
      let scrollBottom = b !== null ? b : document.getElementById('scrollBottom');
        
      if (scrollTop && scrollTop != e.target)
        scrollTop.scrollLeft = pos;

      if (scrollBottom && scrollBottom != e.target)
        scrollBottom.scrollLeft = pos;

      if (this.attachScroll) {
        for(let a of this.attachScroll()) {
          const ch : Element = a.$el ? a.$el : a;
          if (ch != e.target)
            ch.scrollLeft = pos;
        }
      }

      return pos;
    },

    setScrollers() {
      let scrollTop = document.getElementById('scrollTop');
      let scrollBottom = document.getElementById('scrollBottom');

      if (!scrollTop && !scrollBottom) return;

      const ev = (e: any) => {
        this.setScrollPosition(e, scrollTop, scrollBottom);
      }

      if (scrollTop)
        scrollTop.onscroll = ev;

      if (scrollBottom)
        scrollBottom.onscroll = ev;
    },

    checkSelected(item: any) {
      let index = this.table.selecteds.indexOf(item);
      if (index >= 0) {
        this.table.selecteds.splice(index, 1);
      } else {
        this.table.selecteds.push(item);
      }
    },

    selectAll() {

      if (this.table.selecteds.length == 0) {
        for(let item of this.table!.items!) {
          this.table.selecteds.push(item);
        }
      } else {
        this.table.selecteds = [];
      }

      this.$forceUpdate();
    },

    orderBy(col: any) {

      if (!this.table.settings.columnsSortable) {
        return;
      }

      if (col.sortable === false) {
        return;
      }

      if (!this.table.order.column) {
        this.table.order.column = col.key;
      } else {

        if (this.table.order.column == col.key) {
          if (this.table.order.order == 'DESC') {
            this.table.order.order = 'ASC';
          } else {
            this.table.order.order = 'DESC';
            this.table.order.column = null;
          }
        } else {
          this.table.order.column = col.key;
          this.table.order.order = 'DESC';
        }
      }

      this.refreshData();
    },

    setPage(page: any, reload: boolean = true) {
      let num = this.table.pagination.page;

      if (page === '+1') num += 1;
      else if (page === '-1') num -= 1;
      else num = parseInt(page);

      if (num >= 1 && num <= this.table.pagination.totalPages) {
        this.table.pagination.page = num;
        this.table.pagination.offset = (num - 1) * this.table.pagination.perPage;
      }

      if (reload)
      this.refreshData(true);
    },

    setPerPage(v: any) {
      let num = parseInt(v);
      this.table.pagination.perPage = num;
      this.table.pagination.offset = this.table.pagination.page * num;
      this.refreshData(true);
    },

    getPageSizeOptions() {
      return this.table.settings.pageSizeOptions.map((n: number) => {
        return {value: n}
      });
    },

    paginationPagesList() {

      let pages = [];
      for(let i = 1; i <= this.table.pagination.totalPages; ++i) {
        pages.push({value: i+"", content: i+""});
      }
      return pages;

    },

    colFlex(col: any) {
      if (col.flex) return ""+col.flex;
      if (col.width) return "0 0 " + col.width + "px";
      return "1";
    },

    headerCellClass(col: any) {
      const obj : any = {
        ordering: this.table.order.column == col.key, 
        sortable: this.table.settings.columnsSortable && col.sortable !== false
      };

      if (col.cellClass) {
        obj[col.cellClass] = true;
      }

      return obj;
    },

    Reload() {
      this.initializeTable();
      this.refreshData();
    },

    dragChange(e: any) {
      this.$emit('dragChange', e);
    }

  },

  created() {
    this.Reload();
  },

  watch: {
    attachScroll: {
      handler() {
        if (!this.attachScroll) return;

        for(let a of this.attachScroll()) {
          const el = a.$el ? a.$el : a;

          el.onscroll = (e: any) => {
            this.setScrollPosition(e);
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
});