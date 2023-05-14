import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/LoginPage.vue";
import Home from "./views/HomePage.vue";
import NotFound from "./views/NotFound.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Home",
        component: Home,
        alias: [ "/home", "/index" ],
        meta: {
            authRequired: true,
            noWarningMessage: true
        }
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: {
            authRequired: false
        }
    },
    {
        path: "/:catchAll(.*)",
        name: "Not Found",
        component: NotFound,
        meta: {
            authRequired: false
        }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, _, next) => {
    if(to.meta.authRequired) {
        // do something
    } else if(to.meta.devOnly) {
        // do something
    } else {
        next();
    }
});

export default router;