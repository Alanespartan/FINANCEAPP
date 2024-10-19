<template lang="pug">
.navbox
    nav.navbar.navbar-expand-lg.navbar-dark.bg-dark(aria-label="navigation bar")
        .container-xl
            router-link.navbar-brand(style="margin: 0", to="/")
                img.d-inline-block.align-top(src="/images/logo.png", width="85", alt="Logo App")
            span.navbar-brand(style="font-size: 32px")
                span(v-if="title !== null") {{ title }}
                span(v-else) {{ $route.name }}
            button.navbar-toggler(
                type="button",
                data-bs-toggle="collapse",
                data-bs-target="#navbarSupportedContent",
                aria-controls="navbarSupportedContent",
                aria-expanded="false",
                aria-label="Toggle navigation"
            )
                span.navbar-toggler-icon

            #navbarSupportedContent.collapse.navbar-collapse
                ul.navbar-nav.ms-auto(style="margin-right: 1rem")
                    li.nav-item.dropdown
                        a#navbarDropdown.nav-link.dropdown-toggle(
                            href="#",
                            role="button",
                            data-bs-toggle="dropdown",
                            aria-haspopup="true",
                            aria-expanded="false",
                            v-if="authorized"
                        ) Tools
                        .dropdown-menu.dropdown-menu-lg-end(aria-labelledby="navbarDropdown")
                            router-link.dropdown-item(
                                to="/tools",
                                :class="{ active: $route.name === 'Tools' }"
                            ) All Tools
                            li
                                hr.dropdown-divider
                            span(v-for="tool of tools" :key="tool.name")
                                router-link.dropdown-item(
                                    :to="tool.homepage",
                                    :class="{ active: $route.name === tool.name }"
                                ) {{ tool.name }}
                    li.nav-item
                        .nav-link(@click="logout", style="cursor: pointer", v-if="authorized") Logout

    .alerts(v-if="alert.type && alert.message")
        .alert.alert-primary.alert-dismissible.fade.show(:class="`alert-${alert.type}`", role="alert")
            p {{ alert.message }}
            button.btn-close(
                v-if="alert.dismissible",
                type="button",
                data-bs-dismiss="alert",
                aria-label="Close",
                @click="dismissAlert()"
            )
//- END NAVBAR
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { Alert } from "@common/types/Notifications";
import { tools } from "../tools";
import store from "../store";
import { logoutWithAlert } from "../auth";

export default defineComponent({
    props: {
        title: { type: String as PropType<string | null>, default: null }
    },
    data: () => ({
        alerts: store.state.notifications.alerts,
        alert: {} as Alert,
    }),
    computed: {
        authorized() { return store.state.user.authorized; },
        tools() {
            if(store.state.config.server.name.includes("Production") || store.state.config.server.name.includes("QA")) {
                return tools.filter((t) => t.mvpCompleted);
            } else {
                return tools;
            }
        }
    },
    created() {
        store.subscribe((mutation) => {
            // listen for an alert creation
            if(mutation.type === "pushNotificationAlert") {
                store.commit("nextAlert");
            } else if(mutation.type === "nextAlert") {
                if(store.state.notifications.currentAlert.type && store.state.notifications.currentAlert.message) {
                    this.alert = store.state.notifications.currentAlert;
                    this.startAlertTimer();
                }
            }
        });
    },
    beforeUnmount() {
        // wipe the alerts if the navbar is unmounted
        store.commit("resetNotificationAlert");
    },
    methods: {
        startAlertTimer() {
            const timeout = this.alert.timeout;
            setTimeout(() => {
                this.alert = {} as Alert;
                store.commit("nextAlert");
            }, timeout);
        },
        logout() { logoutWithAlert(); },
        dismissAlert() {
            this.alert = {} as Alert;
            store.commit("nextAlert");
        }
    }
});
</script>

<style scoped>
.alert {
    margin-bottom: 0rem;
}
nav {
    min-height: 10vh;
}
</style>
