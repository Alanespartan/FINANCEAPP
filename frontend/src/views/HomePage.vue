<template lang="pug">
.container.text-center
    .row
        .col-xs-12
            h1 Welcome
            p#welcome-text
                | You're logged in to #[strong {{ server.name }}] as #[strong {{ name }}].
        .col-xs-12.mb-3
            .card(v-if="authorized")
                .card-header.d-flex.justify-content-center.align-items-center(style="max-height: 41px")
                    span Featured Pages
                    span(style="right: 0; position: absolute")
                        router-link.btn.btn-primary.my-button.pt-0.pb-0.me-2(style="padding-left: 8px; padding-right: 8px" to="/tools") View All Tools
                .card-body
                    .container
                        .row.justify-content-center
                            .col-12.mx-auto
                                .card
                                    .card-body
                                        h5.card-title Jobs Menu
                                        p.card-text
                                            | View all jobs created during tools operations.
                                        router-link.btn.btn-primary.my-button(to="/jobs") View Jobs

        .col-xs-12.mb-3
            .card
                .card-header Support
                .card-body
                    p.card-text
                        ul.list-unstyled.mb-0
                            li: i.bi.bi-box-arrow-up-right.small: a.useful-link(href="https://www.google.com") Google
        div(v-if="loading")
            .col-xs-12()
            .card
                .card-header Extra
                .card-body
                    .d-flex.justify-content-center.align-items-center
                        .spinner-border.spinner(style="margin: 1rem", role="status")
                        span Downloading extra...

        .col-xs-12(v-else)
            .card
                .card-header Extra
                .card-body
                    .container
                        .row.mb-3
                            .col
                                .card.h-100
                                    .card-body
                                        h5.card-title Extra 1
                                        p.card-text(v-if="projects.ccm.length > 0")
                                            ul.list-unstyled.mb-0(v-for="project of projects.ccm")
                                                li: i.bi.bi-box-arrow-up-right.small: a.useful-link(:href="project.link") {{ project.name }}
                                        p.card-text(v-else) Extra 1

                            .col
                                .card.h-100
                                    .card-body
                                        h5.card-title Extra 2
                                        p.card-text(v-if="projects.ccm2 && projects.ccm2.length > 0")
                                            ul.list-unstyled.mb-0(v-for="project of projects.ccm2")
                                                li: i.bi.bi-box-arrow-up-right.small: a.useful-link(:href="project.link") {{ project.name }}
                                        p.card-text(v-else) Extra 2

</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "../store";

export default defineComponent({
    data: () => ({
        loading: true,
    }),
    computed: {
        name()        { return store.state.user.name; },
        server()     { return store.state.config.server; },
        authorized() { return store.state.user.authorized; }
    },
    async created() {
        console.log("Home Created");
    },
    methods: {
        helloWorld() {
            console.log("Hello World");
        }
    }
});
</script>

<style lang="css" scoped>
.card-header {
    background-color: #3B73B9;
    color: #fff;
}
.card-body {
    background-color: #f6f6f6;
}

h5.card-title { margin-bottom: 0.5rem; }
</style>
