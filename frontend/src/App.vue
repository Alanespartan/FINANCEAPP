<template lang="pug">
.d-flex.flex-column.content
    TheNavbar
    ToastNotification
    main
        router-view
    TheFooter.footer
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TheNavbar, TheFooter, ToastNotification } from "./components";
</script>

<style lang="scss">
@import "./assets/styles.scss";
#app {
    min-height: 100vh;
}
main {
    padding-bottom: calc(2rem + 50px);
}
.content {
    position: relative;
    min-height: 100vh;
}
.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #212529;
    color: #fff;
}
// Primevue Tree Select Styles
.p-treeselect-panel.p-component {
    background-color: white !important;
}

.p-treeselect-label {
    padding: 5px 10px !important;
}

.p-treeselect-items-wrapper {
    margin-top: 10px !important;
}

.p-treeselect-trigger {
    display: none;
}

ul.p-tree-container, ul.p-treenode-children{
    list-style: none;
    background-color: white;
}

button.p-tree-toggler {
    background-color: transparent;
    border: none;
}

span.p-treenode-label {
    margin-left: 10px;
}

</style>
