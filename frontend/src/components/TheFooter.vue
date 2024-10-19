<template lang="pug">
footer
    .container
        .row.justify-content-between(v-if="server")
            .col-4
                span Express/Vue App Version {{ version }}
            .col-4(style="text-align: right")
                span() Server: {{ server }}

        .row.justify-content-center(v-else)
            .col-4(style="text-align: center")
                span Express/Vue App Version {{ version }}

</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "../store";

export default defineComponent({
    data: () => ({
        version: store.state.config.version,
        server: store.state.config.server.name
    }),
    created() {
        store.subscribe((mutation) => {
            if(mutation.type === "logout" || mutation.type === "authorize") {
                this.server = store.state.config.server.name;
            }
        });
    }
});
</script>
