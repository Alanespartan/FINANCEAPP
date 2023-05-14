<template lang="pug">
.d-flex.flex-column
    Navbar
    // Toast
    main
        router-view
    Footer
</template>

<script setup lang="ts">
import Navbar from "@components/main/TheNavbar.vue";
import Footer from "@components/main/TheFooter.vue";
// import Toast from "@components/alerts/Toast.vue";
</script>

<style lang="scss">
@import "./assets/styles.scss";
#app {
    min-height: 100vh;
}

main {
    padding-bottom: calc(2rem + 50px);
}
</style>
