<template>
  <div class="app-table-container" v-if="table">
    <p v-if="!table.items">
      <loader />
    </p>

    <div v-if="table.items">

      <!-- Table of headers -->
      <div class="app-table headers" v-if="table.settings.displayHeader">

        <div class="table-selects" v-if="table.selectedOptions">

          <div class="table-item-card-left table-item-select">
            <input type="checkbox" :checked="table.selecteds.length > 0" @change="selectAll()">
          </div>

        </div>

        <div class="table-scroll" id="scrollTop">
          <div class="table-item-card-center">

            <div class="table-data-col text-gray" v-for="col of table.columns" :key="col.key"
            :class="{ordering: table.order.column == col.key, sortable: table.settings.columnsSortable && col.sortable !== false}"
            :style="{flex: colFlex(col)}" @click="orderBy(col)">
              <div>{{ col.label }}</div>
              <svg-icon :name="'chevron-' + (table.order.order == 'ASC' ? 'up' : 'down')"/>
            </div>

          </div>
        </div>

        <div class="table-item-options">
          <div class="table-item-card-right">
            <div v-if="!table.selectedOptions && table.itemOptions" style="width: 40px"></div>
            <dots-menu 
            v-if="table.selectedOptions" 
            :options="table.selectedOptions()"></dots-menu>
          </div>
        </div>

      </div>


      <!-- Table of data -->
      <loader class="reloading-loader" v-if="reloading" />

      <div class="app-table data" v-if="!reloading && table.items.length == 0">
        <p class="empty-message">{{ table.settings.emptyMessage }}</p>
      </div>

      <div class="app-table data" v-if="!reloading && table.items.length > 0">

        <div class="table-selects" v-if="table.selectedOptions">
          <div class="table-item-card-left table-item-select" :class="table.settings.rowClass(item)"
          v-for="item of table.items" :key="item[table.keyProp]">
            <input type="checkbox" :checked="table.selecteds.indexOf(item) >= 0" @change="checkSelected(item)">
          </div>
        </div>

        <div class="table-scroll" id="scrollBottom">

          <draggable-list v-model="table.items" v-if="table.settings.draggable" @change="dragChange($event)">
            <template slot-scope="slot">
               <div class="table-item-card-center" :class="table.settings.rowClass(slot.item)">
                <div class="table-data-col" v-for="(col, index) in table.columns" :key="col.key + '_' + slot.item[table.keyProp]"
                :style="{
                  flex: colFlex(col),
                  'overflow-x': 'auto'
                  }">
                  <div class="table-data-content"
                  :style="{
                    'text-align': col.center ? 'center' : 'left',
                    'padding-left': (col.paddingLeft ? col.paddingLeft : 0) + 'px'
                  }">
                    <div v-if="!col.component" v-html="col.value(slot.item, index)" @click="col.click? col.click(item) : ''"/>
                    <component v-if="col.component" :is="col.component" v-bind="col.props ? col.props(slot.item) : {}"/>
                  </div>
                </div>
            </div>
            </template>
          </draggable-list>

          <div v-if="!table.settings.draggable">
            <div class="table-item-card-center" :class="table.settings.rowClass(item)"
            @click="table.settings.rowClick(item)"
            v-for="item of table.items" :key="item[table.keyProp]">

              <div class="table-data-col" v-for="(col, index) in table.columns" :key="col.key + '_' + item[table.keyProp]"
              :style="{
                flex: colFlex(col),
                'overflow-x': 'auto'
                }">

                <div class="table-data-content" 
                :style="{
                  'text-align': col.center ? 'center' : 'left',
                  'padding-left': (col.paddingLeft ? col.paddingLeft : 0) + 'px'
                }">
                  <div v-if="!col.component" v-html="col.value(item, index)" @click="col.click? col.click(item) : ''"/>
                  <component v-if="col.component" :is="col.component" v-bind="col.props ? col.props(item) : {}"/>
                </div>
              </div>

            </div>
          </div>

        </div>

        <div class="table-item-options">
          <div class="table-item-card-right" :class="table.settings.rowClass(item)"
          v-for="item of table.items" :key="item[table.keyProp]">
            <dots-menu 
            v-if="table.itemOptions && table.itemOptions(item).length > 0"
            :options="table.itemOptions(item)" :model="item"></dots-menu>
          </div>
        </div>

      </div>
      <!-- -->

      <div class="pagination" v-if="table.settings.pagination">
        <div class="pagination-left">

          <div class="perPage" v-if="table.settings.perPageConfigurable">
            <div>{{ $t('table.per_page') }}</div>
            <form-input type="select" 
            :options="paginationOptions" 
            :value="table.pagination.perPage" 
            :inverted="true"
            :onChange="(v) => { setPerPage(v) }"/>
          </div>

        </div>

        <div class="pagination-right" v-if="table.pagination.totalPages > 1">
          <svg-icon name="heroicons-solid/chevron-left" @click="setPage('-1')" />

          <form-input type="select" 
          :options="paginationPagesList()" 
          :value="table.pagination.page" 
          :inverted="true"
          :onChange="(v) => { setPage(v) }"/>

          <div>{{ $t('table.page', {total: table.pagination.totalPages}) }}</div>
          <svg-icon name="heroicons-solid/chevron-right" @click="setPage('+1')"/>
        </div>
      </div>

    </div>
  </div>

  <div v-else>
    Error: table data not configured.
  </div>
</template>

<script lang="ts" src="./app-table.ts"></script>
<style lang="scss" src="./app-table.scss"></style>