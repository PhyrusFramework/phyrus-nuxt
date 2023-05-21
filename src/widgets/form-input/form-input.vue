<template>
    <div class="form-input" :class="{error: error, readonly: readonly}">
        <div class="form-input-label" v-if="label && !['checkbox'].includes(type)">
            {{label}}
            <span v-if="required" class="required">*</span>
        </div>

        <input v-if="!type || ['text', 'number', 'email', 'date', 'color'].includes(type)"
        :class="{hideControls: hideControls || clearx}"
        :disabled="isDisabled()"
        :placeholder="placeholder" 
        :maxlength="length ? length : ''"
        :max="max"
        :min="min"
        :step="step"
        :type="type ? type : 'text'"
        @keyup.enter="onSubmit()"
        v-bind:value="getValue()"
        @focus="focused()"
        @blur="blurred()"
        v-on:input="emit($event.target.value)"
        ref="normalInput">

        <div v-if="type == 'time'" class="flex-row time-picker">
            <input v-model="pseudoValue.hour" @input="timeChanged()">
            <span>:</span>
            <input v-model="pseudoValue.minute" @input="timeChanged()">
        </div>

        <div v-if="type == 'datetime'" class="flex-row time-picker">
            <form-input type="date" class="flex-grow" v-model="pseudoValue.date" @input="timeChanged()"/>
            <form-input type="time" class="time-select" v-model="pseudoValue.time" :time="pseudoValue.time" @input="timeChanged()"/>
        </div>

        <div class="flex-row checkbox-input" v-if="type == 'checkbox'">
            <input
            :disabled="isDisabled()"
            type="checkbox"
            :checked="value"
            v-bind:value="value"
            v-on:input="emit($event.target.checked)"
            ref="checkboxInput">

            <div class="flex-row" v-if="label">
                {{label}}
                <span v-if="required" class="required">*</span>
            </div>
        </div>


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
        v-bind:value="value" 
        v-on:input="emit($event)" 
        :size="size"/>

        <textarea v-if="type == 'textarea'" 
        :disabled="isDisabled()"
        :placeholder="placeholder" 
        :rows="rows ? rows : 8" 
        :maxlength="length ? length : ''"
        v-bind:value="value"
        @focus="focused()"
        @blur="blurred()"
        v-on:input="emit($event.target.value)"
        ref="textareaInput"/>

        <input v-if="type == 'phone'" ref="phoneInput" class="phone-input"/>

        <div class="password-input" v-if="type == 'password'">
            <input :type="displayContent ? 'text': 'password'"
            :placeholder="placeholder"
            :maxlength="length ? length : ''"
            v-bind:value="value"
            v-on:input="emit($event.target.value)"
            :disabled="isDisabled()"
            @focus="focused()"
            @blur="blurred()"
            @keyup.enter="onSubmit()"
            ref="passwordInput">

            <svg-icon :name="displayContent ? 'heroicons-solid/eye-off' : 'heroicons-solid/eye'" @click="changePasswordVisibility()"/>
        </div>

        <slider-select
        v-if="!reloading && ['select', 'country'].includes(type) && !multiple" 
        :value="value"
        :placeholder="placeholder" 
        :options="optionsForSelect()"
        :onChange="emit"
        :inverted="inverted"
        :disabled="isDisabled()"
        :comparer="comparer"
        :component="component"
        :props="props"
        :beforeChange="beforeChange"
        :clearx="clearx"
        @key="passEvent('key', $event)"/>

        <multiselect v-if="!reloading && type == 'select' && multiple" 
        :value="value" :placeholder="placeholder"
        :options="options" :multiple="true" :separator="separator"
        :disabled="isDisabled()"
        @input="emit($event)" :comparer="comparer"/>

        <editor v-if="type == 'editor'" :mode="mode ? mode : 'simple'" 
        ref="editorInput"
        :value="value"
        :toolbar="toolbar"
        @change="passEvent('write', $event)"
        @focus="focused()"
        @blur="blurred()"
        @input="emit($event)"/>

        <div class="form-input-calendar" v-if="type == 'calendar'">
            <div class="flex-row">
                <div class="calendar-selected-label"
                :style="{color: !value ? 'lightgray' : ''}"
                @click="clickOnCalendar()">{{ calendarValueLabel() }}</div>
                
                <close-x v-if="value" style="margin-left: 5px" @click="clear(null)" />
                
                <icon-popup icon="entypo/calendar" ref="iconPopup" side="auto" 
                :style="{'margin-left': value || placeholder ? '5px' : ''}">
                    <calendar v-model="pseudoValue" 
                    @change="emitCalendarDate(pseudoValue)"
                    :range="range" ref="calendar"/>
                </icon-popup>
            </div>
        </div>

        <div class="footer">
            <div class="length" v-if="length" :class="{overpassed: lengthOverpassed()}">
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

        <div class="clearx" v-if="clearx">
            <close-x @click="clear()"/>
        </div>
    </div>
</template>

<script lang="ts" src="./form-input.ts"></script>
<style lang="scss" src="./form-input.scss"></style>