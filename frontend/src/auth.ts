import store from "./store";
import router from "./router";
import { get, post } from "./api";
import Swal from "sweetalert2";

export type LoginResponse = { success: boolean, message: string; timeoutMs?: number };
const SKIP_API_ERROR_HANDLE = true;

export function checkLoggedIn() {
    return get("/status/whoami");
}

export function logoutWithAlert(noRedirect?: boolean) {
    const alert = {
        type: "success",
        message: "Successfully signed out.",
        timeout: 10000,
        dismissible: true
    };
    post("/logout", {}).then(() => {
        store.dispatch("logout", alert);
        if(!noRedirect) { router.push("/login"); }
    });
}

export function logout(noRedirect?: boolean) {
    post("/logout", {}).then(() => {
        store.commit("logout");
        if(!noRedirect) { router.push("/login"); }
    });
}

export async function login(email: string, password: string, server: { url: string }): Promise<LoginResponse> {
    const payload = {
        email,
        password
    };
    const headers = {
        "Content-Type": "application/json"
    };
    return await post("/login", payload, headers, store.state.config.api_v1, SKIP_API_ERROR_HANDLE)
        .then(() => {
            const props = {
                email,
                server
            };
            store.commit("authorize", props);
            return {
                success: true,
                message: ""
            };
        })
        .catch((error) => {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        return {
                            success: false,
                            message: "Your credentials were rejected by the server."
                        }
                    case 403:
                        Swal.fire({
                            title: "Account Locked",
                            text: "Your account has been locked due to too many login attempts. Please try again in 5 minutes.",
                            icon: "error",
                            confirmButtonColor: "#d33",
                            confirmButtonText: "Okay",
                            showCancelButton: false,
                            allowOutsideClick: false
                        });
                        return {
                            success: false,
                            message: "Account locked.",
                            timeoutMs: 5 * 60 * 1000 // 5min
                        };
                    case 400:
                        return {
                            success: false,
                            message: "Invalid server and repository configuration. Ensure the selected repository exists on the selected server."
                        };
                    case 500:
                    default:
                        return {
                            success: false,
                            message: "A server error occurred while trying to process your request."
                        };
                }
            } else {
                return {
                    success: false,
                    message: "A server error occurred while trying to process your request: No response given."
                };
            }
        });
}
