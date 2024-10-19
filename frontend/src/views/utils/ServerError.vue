<template lang="pug">
.container.not-found.text-center
    h1 Error 500 - Internal Server Error
    .card(style="margin-bottom: 1rem;")
        .card-body
            h4.card-title What caused this?
            h5.card-title There is an issue on the Server
            p.card-text The server is having trouble responding to your request. This could be because the response from AvALM was invalid, or the data sent to the server was incorrect.
            br
            h6.card-subtitle.mb-2.text-muted The error has been logged and can be reviewed if it persists.
    .button-group
        router-link.btn.btn-danger.alert-danger(to="/") Home
        button.btn.btn-danger.alert-danger(@click="logoutWithAlert()") Logout
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { logoutWithAlert } from "../../auth";
</script>

<style scoped>
.button-group {
    margin-top: 1rem;
    display: inline;
    width: 75%;
}
.not-found {
    margin-top: 3rem;
}
.btn-danger {
    width: 30%;
    margin: 0rem 0.25rem 0rem 0.25rem;
}
</style>
