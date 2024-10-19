import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import type { Alert, Toast } from "@common/types/Notifications";

const getDefaultState = () => {
    return {
        user: {
            authorized: false,
            developer: false,
            name: "",
        },
        config: {
            api_v1: "/api/v1",
            api_v2: "/api/v2",
            server: {
                name: "",
                url: "",
                id: ""
            },
            version: "1.0", // Must match backend/package.json
            loginAllowed: true,
        },
        alerts: {
            global: {},
            login: {},
        },
        notifications: {
            currentToast: {} as Toast,
            currentAlert: {} as Alert,
            toasts: [] as Toast[],
            alerts: [] as Alert[],
            login: {}
        },
        loginRedirect: ""
    };
};

const vuexLocal = new VuexPersistence<any>({
    storage: window.localStorage
});

export default createStore({
    plugins: [ vuexLocal.plugin ],
    state: getDefaultState(),
    getters: {
        authStatus: (state) => {
            return state.user.authorized;
        }
    },
    mutations: {
        // Auth
        authorize(state, props) {
            state.user.name       = props.name;
            state.config.server   = props.server;
            state.user.authorized = true;
        },
        logout(state) {
            Object.assign(state, getDefaultState());
        },

        // User
        updateUser(state, user) {
            state.user.name = user.name;
        },

        // Alerts
        pushNotificationToast(state, toast) {
            state.notifications.toasts.push(toast);
        },
        pushNotificationAlert(state, alert) {
            state.notifications.alerts.push(alert);
        },
        pushLoginAlert(state, alert) {
            state.notifications.login = alert;
        },
        nextAlert(state) {
            if(state.notifications.alerts.length > 0) {
                state.notifications.currentAlert = state.notifications.alerts[0];
                state.notifications.alerts.splice(0, 1);
            } else {
                state.notifications.currentAlert = {} as Alert;
            }
        },
        nextToast(state) {
            if(state.notifications.toasts.length > 0) {
                state.notifications.currentToast = state.notifications.toasts[0];
                state.notifications.toasts.splice(0, 1);
            } else {
                state.notifications.currentToast = {} as Toast;
            }
        },
        resetNotificationToast(state) {
            state.notifications.toasts = getDefaultState().notifications.toasts;
        },
        resetNotificationAlert(state) {
            state.notifications.alerts = state.notifications.toasts = getDefaultState().notifications.alerts;
        },
        wipeLoginAlert(state) {
            state.notifications.login = {};
        },
    },
    actions: {
        logout: ({ commit }, alert) => {
            commit("logout");
            commit("pushNotificationToast", alert);
        }
    },
    modules: {
    }
});
