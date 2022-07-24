<template>
    <div class="app-form" v-if="rows">

        <div class="row row-padding" v-for="(row, index) in rows" :key="index">

            <div v-for="(col) in row" :key="col.field.name" class="col-1" :class="classForColumn(col)" 
            :style="{display: (col.field && (!col.field.condition || col.field.condition() || col.field.conditionPlaceholder) ) ? 'block' : 'none'}">

                <div v-if="displayConditionPlaceholder(col)" 
                v-html="getConditionPlaceholder(col)"/>

                <div class="app-form-input" :class="classForField(col.field)"
                v-if="col.field && (!col.field.condition || col.field.condition())">

                    <form-input 
                    v-if="!['image', 'photo', 'custom'].includes(col.field.type)" 
                    v-model="col.field.model[col.field.name]" v-bind="col.field.props" :type="col.field.type"
                    :error="col.field.error"
                    @change="valueChanged(col.field)"/>

                    <dropzone class="photo-picker" :clickable="true" 
                    @change="valueChanged(field)"
                    v-bind="col.field.props ? col.field.props : {}"
                    v-if="['image', 'photo'].includes(col.field.type)" @drop="fileSelected(col.field, $event)">
                        <circle-image size="120" :src="col.field.fileSrc"/>
                        <div>{{ $t('media.select') }}</div>
                    </dropzone>

                    <div class="form-input" v-if="col.field.type == 'custom'">
                        <div class="form-input-label" v-if="col.field.props.label">{{ col.field.props.label }}</div>
                        <div v-if="col.field.content" v-html="col.field.content(col.field.model)" v-bind="col.field.props ? col.field.props : {}"/>
                        <component v-if="col.field.component" :is="col.field.component" v-bind="col.field.props"/>
                    </div>

                </div>

            </div>
        </div>

    </div>
</template>

<script lang="ts" src="./app-form.ts"></script>
<style lang="scss" src="./app-form.scss"></style>