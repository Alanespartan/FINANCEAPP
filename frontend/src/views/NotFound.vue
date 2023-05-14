<template lang="pug">
.container-fluid
    .row
        .col-12.text-center
            h1 404: Page not found.
            h4 The page that you requested could not be found.
            <router-link to="/" class="btn btn-primary">Home</router-link>
            button.btn.btn-secondary.text-center(
                @click="goBack()"
                type="button"
            ) span Go Back
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { login, logout } from "../lib/auth";
// import { get } from "../lib/api";

export default defineComponent({
    name: "LoginPage",
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
    methods: {
        doSomething() {
            console.log("do something");
        },
        goBack() {
            this.$router.push("/");
        }
    }
});
</script>

<style scoped lang="scss">

</style>