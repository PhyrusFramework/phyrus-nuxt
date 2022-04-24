<template>
    <div>
        <loader :color="color"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: ['color']
});
</script>