<template lang="pug">
.container.login-page
    .row.justify-content-center
        .col-xs-12.col-sm-10.col-md-8.col-lg-6.col-xl-5.mt-3.pa-3
            .text-center
                //- This shows up with a blue default alert, need to find a way to stop it.
                //- .alerts(v-if="alert")
                //-     .alert.alert-primary.alert-dismissible.fade.show(:class="`alert-${alert.type}`", role="alert")
                //-         span {{ alert.message }}
                h4.py-3 Please sign in
            form(method="POST" @submit.prevent action="/login")
                .alert.alert-danger.d-flex.align-items-center.alert-danger(v-if="error", role="alert")
                    i.bi.bi-exclamation-triangle-fill.md
                    span.error-message {{ error }}

                .mb-3
                    .form-label(for="username") Credentials
                    input#username.form-control.mb-2(type="text", name="username", placeholder="SSO", required, autofocus, v-model="form.username", :disabled="disableAll")
                    .form-label(for="password")
                    input#password.form-control(type="password", name="password", placeholder="Password", required, v-model="form.password", :disabled="disableAll")
                .d-flex.justify-content-center.align-items-center(v-if="downloadingInfo")
                    .spinner-border.spinner(style="margin: 1rem", role="status")
                    span Downloading server information
                div(v-else)
                    .mb-3
                        label.form-label(for="form-server") Server
                        v-select#server-selection.login-select(
                            :options="servers",
                            label="name",
                            inputId="form-server",
                            name="server-selection",
                            placeholder="Choose a server",
                            v-model="form.server",
                            :disabled="disableAll"
                        )
                .button-group.mb-5
                    button#login-button.btn.btn-primary.my-button.mb-2.w-100(
                        type="submit",
                        :disabled="disableAll || form.username === '' || form.password === '' || !form.server",
                        @click="signIn()"
                    )
                        span(v-show="!signInLoading") Sign In
                        .spinner-border.text-light.login-spinner(v-show="signInLoading", role="status")
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Alert } from "@common/types/Notifications";
import type { Server } from "@common/types/Servers";
import store from "../store/index";
import router from "../router";
import { login } from "../auth";
import { get } from "../api";

export default defineComponent({
    data: () => ({
        error: "",
        servers: [] as Server[],
        signInLoading: false,
        alert: store.state.alerts.login as Alert,
        disableAll:  false,
        downloadingInfo: true,
        form: {
            username: "",
            password: "",
            server: undefined as Server | undefined,
            // instanceEndpoint: {} as Record<string, any>,
        }
    }),
    created() {
        if(store.state.user.authorized) {
            router.push("/");
            store.commit("resetLoginRedirect");
            store.commit("pushNotificationToast", { type: "success", message: "Successfully signed in.", timeout: 5000, dismissible: true });
        } else {
            this.getServerInfo();
        }
    },
    beforeUnmount() {
        store.commit("wipeLoginAlert");
    },
    methods: {
        signIn() {
            this.error = "";
            this.signInLoading = this.disableAll = true;
            if(!this.form.server) {
                this.error = "You must select a server";
                return;
            }
            login(this.form.username, this.form.password, this.form.server).then((res) => {
                if(!res.success) {
                    if(res.timeoutMs) {
                        this.disableAll = true;
                        this.signInLoading = false;
                        const timeout = res.timeoutMs;
                        this.waitForAccountUnlock(timeout);
                    } else {
                        this.signInLoading = false;
                        this.disableAll = false;
                    }
                    this.error = res.message || "An error occurred while logging you in.";
                } else {
                    this.signInLoading = false;
                    this.disableAll = false;
                    window.location.href = window.location.origin + "/api/oidc/login";
                }
            });
        },
        getServerInfo() {
            get<{ serverRes: Server[] }>("/servers")
                .then((res) => {
                    const serversData = res.data.serverRes;
                    const url = window.location.hostname;
                    if(url.includes("localhost") || url.includes("127.0.0.1") || url.includes("0.0.0.0")) { this.servers = serversData; }
                    else if(url.includes("qa"))   { this.servers = serversData.filter((server) => server.id.includes("qa")); }
                    else if(url.includes("dev"))  { this.servers = serversData.filter((server) => server.id.includes("dev")); }
                    else { this.servers = this.servers = serversData.filter((server) => server.id.includes("prod")); }
                    this.form.server = this.servers[0];
                    this.downloadingInfo = false;
                })
                .catch((err) => {
                    console.error(err);
                    this.disableAll = true;
                    this.error = "Unable to get server list.";
                    this.downloadingInfo = false;
                });
        },
        waitForAccountUnlock(timeoutMs: number) {
            if(timeoutMs < 1000) {
                this.disableAll = false;
                this.error = "";
                return;
            }
            this.error = `Account locked. Please try again in ${timeoutMs / 1000} seconds`;
            setTimeout(() => {
                this.waitForAccountUnlock(timeoutMs - 1000);
            }, 1000);
        }
    }
});
</script>

<style scoped lang="scss">
.login-spinner {
    height: 1rem !important;
    width: 1rem !important;
    padding: 0 !important;
    margin: 0 !important;
    border: 0.15em solid currentColor !important;
    vertical-align: -0.15em !important;
    border-right-color: transparent !important;
}
.login-select {
    background-color: #fff;
    padding: 0rem 0rem 0rem 0rem !important;
}
</style>
