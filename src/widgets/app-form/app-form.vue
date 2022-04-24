<template>
    <div class="app-form" v-if="cols">

        <div v-for="(col, index) in cols" :key="index" class="col-1" :class="classForColumn(col)">

            <div class="app-form-input" v-for="(field, index) in getColumnFields(col)" :key="index" :class="classForField(field)">

                <form-input v-if="['text', 
                'password', 
                'email', 
                'number', 
                'textarea', 
                'checkbox', 
                'select', 
                'date', 
                'color', 
                'phone', 
                'country', 
                'editor',
                'radio'].includes(field.type)" 
                v-model="field.model[field.name]" v-bind="field.props" :type="field.type"
                :error="field.error"/>

                <dropzone class="photo-picker" :clickable="true" 
                v-bind="field.props ? field.props : {}"
                v-if="['image', 'photo'].includes(field.type)" @drop="fileSelected(field, $event)">
                    <circle-image size="120" :src="field.fileSrc"/>
                    <div>{{ $t('media.select') }}</div>
                </dropzone>

                <div class="form-input" v-if="field.type == 'custom'">
                    <div class="form-input-label" v-if="field.props.label">{{ field.props.label }}</div>
                    <div v-if="field.content" v-html="field.content(field.model)" v-bind="field.props ? field.props : {}"/>
                    <component v-if="field.component" :is="field.component" v-bind="field.props"/>
                </div>

            </div>

        </div>

    </div>
</template>

<script lang="ts" src="./app-form.ts"></script>
<style lang="scss" src="./app-form.scss"></style>