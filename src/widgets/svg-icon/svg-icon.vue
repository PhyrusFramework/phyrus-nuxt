<template>
    <svg xmlns="http://www.w3.org/2000/svg" class="icon sprite-icons" @click="clickEvent($event)"
    :class="classForIcon()">
        <use :href="'/svg-icons/' + lib + '.svg#i-' + iconName" 
        :xlink:href="'/svg-icons/' + lib + '.svg#i-' + iconName"></use>
    </svg>
</template>

<script lang="ts">
import Vue from 'vue';
import Config from '../../modules/config';

export default Vue.extend({
    props: ['name', 'source', 'onClick', 'iconClass'],

    data() {
        let data : {
            iconName: '',
            lib: string
        } = {
            iconName: '',
            lib: ''
        }
        return data;
    },

    created() {
        this.parseName();
    },

    methods: {
        clickEvent($e: any) {
            this.$emit('click', $e);

            if (this.onClick) {
                this.onClick($e);
            }
        },

        classForIcon() {
            let cl : any = {}

            if (this.iconClass) {
                cl[this.iconClass] = true;
            }

            return cl;
        },

        parseName() {
            this.iconName = this.name;
            if (this.name.indexOf('/') >= 0) {
                let parts = this.name.split('/');
                this.iconName = parts[1];
                this.lib = parts[0];
            } else {
                this.lib = this.source ? this.source : Config.get().theme.defaultIconSource;
            }
        }
    },

    watch: {
        $props: {
        handler() {
            this.parseName();
        },
        deep: true,
        immediate: true,
        },
    },
});
</script>
