<template lang="pug">
.container.text-center
    h1 Your New Tool!
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
    name: "NEW",
    props: {
        propOne: { type: Object as PropType<any>, default: () => ({}) },
        propTwo: { type: String, required: false }
    },
    components: {},
    data: () => ({}),
    created() {},
    mounted() {},
    unmounted() {},
    methods: {}
});
</script>

<style lang="scss" scoped>
/* Your CSS goes here */
/* "Scoped" means the CSS is only available to elements on this page. */
</style>
