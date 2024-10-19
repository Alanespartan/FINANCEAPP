import { createRouter, createWebHistory } from "vue-router";
import { routes as toolRoutes } from "./tools";
import type { RouteRecordRaw }  from "vue-router";
import store from "./store";

import Tools from "./views/ToolsPage.vue";
import Home  from "./views/HomePage.vue";
import Login from "./views/LoginPage.vue";

import JobMenu       from "./views/jobs/JobMenu.vue";
import JobStatus from "./views/jobs/JobStatus.vue";

import ServerError from "./views/utils/ServerError.vue";
import NotFound    from "./views/utils/NotFound.vue";

const routes: Array<RouteRecordRaw> = [
    // Ensure "name" uses capital letters.
    {
        path: "/",
        name: "Home",
        component: Home,
        alias: [ "/home", "/index" ],
        meta: {
            authRequired: true,
            noWarningMessage: true,
        }
    },
    {
        path: "/login",
        name: "Express App",
        component: Login,
        meta: {
            authRequired: false,
        }
    },
    {
        path: "/jobs",
        name: "Job Menu",
        component: JobMenu,
        meta: {
            authRequired: true
        }
    },
    {
        path: "/jobs/:id",
        name: "Job Status",
        component: JobStatus,
        meta: {
            authRequired: true
        }
    },
    {
        path: "/server-error",
        name: "Server Error",
        component: ServerError,
        meta: {
            authRequired: false,
        }
    },
    {
        path: "/tools",
        name: "Tools",
        component: Tools,
        meta: {
            authRequired: true,
        }
    },
    ...toolRoutes,
    // This path MUST always be last:
    {
        path: "/:catchAll(.*)",
        name: "Not Found",
        component: NotFound,
        meta: {
            authRequired: false,
        }
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, _, next) => {
    if(to.meta.authRequired && !store.state.user.authorized) {
        if(!to.meta.noWarningMessage) {
            const errorMessage = `You need to sign in to access ${to.name ? to.name.toString() : "the requested resource"}.`;
            store.commit("pushLoginAlert", {type: "warning", message: errorMessage});
        }
        store.commit("setLoginRedirect", to.path);
        next({name: "Express App"});
    } else if(to.meta.devOnly && !store.state.user.developer) {
        const errorMessage = "You need to be a developer to access that page.";
        store.commit("pushNotificationToast", { type: "warning", message: errorMessage, timeout: 10000, dismissible: true });
        next({name: "Home"});
    } else {
        next();
    }
});

export default router;
