<template>
    <div class="form-input" :class="{error: error, readonly: readonly}">
        <div class="form-input-label" v-if="label">
            {{label}}
            <span v-if="required" class="required">*</span>
        </div>

        <input v-if="!type || ['text', 'number', 'email', 'date', 'color'].includes(type)"
        :class="{hideControls: hideControls}"
        :disabled="disabled || readonly"
        :placeholder="placeholder" 
        :maxlength="length ? length : ''"
        :max="max"
        :min="min"
        :step="step"
        :type="type ? type : 'text'"
        @keyup.enter="onSubmit()"
        v-bind:value="value"
        @focus="focused()"
        v-on:input="emit($event.target.value)"
        ref="normalInput">

        <input v-if="type == 'checkbox'"
        :disabled="disabled || readonly"
        type="checkbox"
        :checked="value"
        v-bind:value="value"
        v-on:input="emit($event.target.checked)"
        ref="checkboxInput">

        <div class="flex-row" v-if="type == 'radio' && option"
        @click="labelClickable ? emit(option.value) : ''">
            <div class="radio-button" 
            @click="labelClickable ? '' : emit(option.value)"
            :class="{active: comparer ? comparer(value, option.value) : value == option.value}">
                <div class="radio-button-selected" />
            </div>

            <div>{{ option.content ? option.content : (option.label ? option.label : option.value) }}</div>
        </div>

         <toggle v-if="type == 'toggle'"
        value="value" @change="emit($event)" :size="size"/>

        <textarea v-if="type == 'textarea'" 
        :disabled="disabled || readonly"
        :placeholder="placeholder" 
        :rows="rows ? rows : 8" 
        :maxlength="length ? length : ''"
        v-bind:value="value"
        @focus="focused()"
        v-on:input="emit($event.target.value)"
        ref="textareaInput"/>

        <input v-if="type == 'phone'" ref="phoneInput" class="phone-input"/>

        <div class="password-input" v-if="type == 'password'">
            <input :type="displayContent ? 'text': 'password'"
            :placeholder="placeholder"
            :maxlength="length ? length : ''"
            v-bind:value="value"
            v-on:input="emit($event.target.value)"
            :disabled="disabled || readonly"
            @focus="focused()"
            @keyup.enter="onSubmit()"
            ref="passwordInput">

            <svg-icon :name="displayContent ? 'heroicons-solid/eye-off' : 'heroicons-solid/eye'" 
            @click="changePasswordVisibility()"/>
        </div>

        <slider-select
        v-if="['select', 'country'].includes(type) && !multiple" 
        :value="value"
        :placeholder="placeholder" 
        :options="optionsForSelect()"
        :onChange="emit"
        :inverted="inverted"
        :disabled="disabled || readonly"
        :comparer="comparer"/>

        <multiselect v-if="type == 'select' && multiple" 
        :value="value" :placeholder="placeholder"
        :options="options" :multiple="true" :separator="separator"
        :disabled="disabled || readonly"
        @input="emit($event)" :comparer="comparer"/>

        <editor v-if="type == 'editor'" :mode="mode ? mode : 'simple'" :value="value"
        @input="emit($event)"/>

        <div class="footer">
            <div class="length" v-if="length">
                {{character_count}}/{{length}}
            </div>

            <div class="error" v-if="typeof error == 'string'">
                {{ error }}
            </div>
        </div>

        <div class="suggestions" v-if="suggestions && suggestions.length > 0">
            <div class="suggestion" v-for="(suggestion, index) in suggestions" 
            :key="index" @click="selectSuggestion(suggestion)">
                <component v-if="suggestion.component" :is="suggestion.component" v-bind="suggestion.props" />
                <div v-if="suggestion.content" v-html="suggestion.content" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./form-input.ts"></script>
<style lang="scss" src="./form-input.scss"></style>