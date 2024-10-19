<template>
    <div class="container not-found">
        <div class="text-center">
            <div>
                <img
                    src="/images/logo.png"
                    alt="App Logo"
                    width="200"
                />
            </div>
            <br />
            <h1>404: Page not found.</h1>
            <h4>The page that you requested could not be found.</h4>
            <div class="button-group">
                <router-link to="/" class="btn btn-primary">Home</router-link>
                <input
                    class="btn btn-primary"
                    value="Go Back"
                    type="button"
                    @click="goBack()"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goBack() {
    window.history.length > 1
        ? router.go(-1)
        : router.push("/");
}
</script>

<style scoped>
.button-group {
    margin-top: 1rem;
    display: inline;
}
.not-found {
    margin-top: 3rem;
}
</style>
