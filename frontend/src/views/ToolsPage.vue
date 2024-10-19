<template lang="pug">
.container.text-center
    nav(aria-label="breadcrumb")
        ol.breadcrumb
            li.breadcrumb-item
                a(href="/") Home
    .row
        .col-12.col-md-6.col-lg-4.mb-4(v-for="tool of tools" :key="tool.id")
            .card.h-100
                .card-header.p-1(
                    :class="toolBackground(tool)"
                )
                    span(v-text="tool.name")
                .card-body
                    p.card-text
                        | {{ tool.description }}
                    span.d-block.mb-2.text-success(v-if="tool.mvpCompleted && !tool.inDevelopment") Tool is operational and ready to use
                    span.d-block.mb-2.text-warning(v-else-if="tool.mvpCompleted && tool.inDevelopment") Tool has pending development and is not a complete product
                    span.d-block.mb-2.text-danger(v-else-if="!tool.mvpCompleted && tool.inDevelopment") Tool is in active development
                    router-link.btn.btn-primary.my-button(:to="tool.homepage") Go to Tool
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { tools } from "../tools";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import store from "../store";
import { defineComponent } from "vue";

export default defineComponent({
    props: {},
    data: () => ({}),
    computed: {
        tools() {
            if(store.state.config.server.name.includes("Production") || store.state.config.server.name.includes("QA")) {
                return tools.filter((t) => t.mvpCompleted).sort((a, b) => a.priority - b.priority);
            } else {
                return tools.sort((a, b) => a.priority - b.priority);
            }
        }
    },
    methods: {
        toolBackground(tool: any) {
            return tool.mvpCompleted && !tool.inDevelopment ? "bg-success" : tool.mvpCompleted && tool.inDevelopment ? "bg-warning" : "bg-danger";
        }
    }
});
</script>

<style scoped lang="scss">
.my-button {
    max-width: 50%;
}
.card-header {
    background-color: #3B73B9;
    color: #fff;
    font-size: 1.5rem;
}
.card-body {
    background-color: #f6f6f6;
}
</style>
