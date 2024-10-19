<template lang="pug">
.toast-container.position-absolute.p-3.top-0.end-0#geToast(v-if="toast.type && toast.message")
    .toast.border-0.show(:class="`alert-${toast.type}`" role="alert" aria-live="assertive" aria-atomic="true")
        .d-flex
            .toast-body
                span(style="font-size: 1rem;") {{ toast.message }}
            button.btn-close.btn-close-white.me-2.m-auto(aria-label="Close" v-if="toast.dismissible" @click="dismiss()")
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Toast } from "@common/types/Notifications";
import store from "../../store";

export default defineComponent({
    data: () => ({
        toasts: store.state.notifications.toasts,
        toast: {} as Toast
    }),
    created() {
        store.subscribe((mutation) => {
            // listen for a toast creation
            if(mutation.type === "pushNotificationToast") {
                store.commit("nextToast");
            } else if(mutation.type === "nextToast") {
                if(store.state.notifications.currentToast.type && store.state.notifications.currentToast.message) {
                    this.toast = store.state.notifications.currentToast;
                    this.startTimer();
                }
            }
        });
    },
    beforeUnmount() {
        store.commit("resetNotificationToast");
    },
    methods: {
        startTimer() {
            const timeout = this.toast.timeout;
            setTimeout(() => {
                this.toast = {} as Toast;
                store.commit("nextToast");
            }, timeout);
        },
        dismiss() {
            this.toast = {} as Toast;
            store.commit("nextToast");
        }
    }
});
</script>

<style scoped>
#geToast {
    margin-top: 10vh;
    z-index:100
}
</style>
