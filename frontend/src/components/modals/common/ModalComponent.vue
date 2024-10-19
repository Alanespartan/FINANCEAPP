<template lang="pug">
    div(v-on:click="close()" tabindex="-1")
        .modal
            .modal-dialog
                .modal-content
                    .modal-header
                        h5.modal-title {{ title }}
                    .modal-body
                        p.overflow-auto(v-html="content")
                    .modal-footer
                        button.btn.btn-secondary(type="button" @click="close()")
                            | Close
                        button(type="button" :class="`btn btn-${type}`" @click="confirm()" v-html="confirmButtonText")
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        type: String,
        title: String,
        content: String,
        confirmButtonText: String
    },
    emits: [ "close", "confirm" ],
    methods: {
        close() { this.$emit("close"); },
        confirm() { this.$emit("confirm"); }
    }
});
</script>

<style scoped>
.modal {
    display: inline !important;
    background: rgba(0, 0, 0, 0.5);
}
</style>
