<template lang="pug">
.container-fluid
    .row
        .col-12.text-center
            span Navbar
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
    name: "TheNavbar",
    props:{
        title: { type: String as PropType<string | null>, default: null }
    },
    components: {
        // Modals, Alerts, etc
    },
    data: () => ({
        loaded: false,
        title: undefined as string | undefined,
        tasks: [] as string[]
    }),
    beforeRouteLeave(to, _from, next) {
        const params = to.params;
        if(params) {
            this.doSomething();
            next();
        } else {
            next("/");
        }
    },
    created() {

    },
    mounted() {

    },
    computed: {

    },
    methods: {
        doSomething() {
            console.log("do something");
        }
    }
});
</script>

<style scoped lang="scss">

</style>