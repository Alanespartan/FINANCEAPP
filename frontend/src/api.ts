import axios, { type AxiosRequestHeaders } from "axios";
import type { AxiosError, AxiosResponse } from "axios";
import Swal from "sweetalert2";

import router from "./router";
import store from "./store/index";

import type { JobSummary, JobSummaryResponse } from "@common/types/job"
import type { LogItemResponse } from "@common/types/logger";
import type { TaskLogItem, TaskResponse, Task } from "@common/types/task"
import type { APIJob, APIJobResponse } from "@common/types/job";
function buildSecurityHeaders(requestHeaders: AxiosRequestHeaders): AxiosRequestHeaders {
    return requestHeaders;
}

async function errorResolver<T = unknown>(err: AxiosError<T>) {
    if(err.response?.status === 401) {
        logout();
    } else if(err.response?.status === 400) {
        Swal.fire({
            title: "Bad Request",
            text: "The server did not understand the request or could not read the request body.",
            icon: "warning",
            confirmButtonColor: "#ffc107",
            confirmButtonText: "Okay",
            showCancelButton: false,
            allowOutsideClick: false
        });
    } else if(err.response?.status === 403) {
        Swal.fire({
            title: "Forbidden",
            text: "You are not allowed to perform that action.",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "Okay",
            showCancelButton: false,
            allowOutsideClick: false
        });
    } else if(err.response?.status === 404) {
        Swal.fire({
            title: "Not Found",
            text: "A resource that was requested cannot be found. Would you like to continue or logout?",
            icon: "warning",
            confirmButtonColor: "#ffc107",
            confirmButtonText: "Continue",
            showCancelButton: true,
            cancelButtonText: "Logout",
            allowOutsideClick: false,
        }).then((result) => {
            if(result.dismiss === Swal.DismissReason.cancel) {
                logoutNoAlert();
            }
        });
    } else if(err.response?.status === 408) {
        Swal.fire({
            title: "Request Timeout",
            text: "The server timed out waiting for the request to be completed. Would you like to continue or logout?",
            icon: "warning",
            confirmButtonColor: "#ffc107",
            confirmButtonText: "Continue",
            showCancelButton: true,
            cancelButtonText: "Logout",
            allowOutsideClick: false,
        }).then((result) => {
            if(result.dismiss === Swal.DismissReason.cancel) {
                logoutNoAlert();
            }
        });
    }  else if(err.response?.status === 410) {
        Swal.fire({
            title: "Gone",
            text: "A resource that was requested was previously in use but is no longer available. Would you like to continue or logout?",
            icon: "warning",
            confirmButtonColor: "#ffc107",
            confirmButtonText: "Continue",
            showCancelButton: true,
            cancelButtonText: "Logout",
            allowOutsideClick: false,
        }).then((result) => {
            if(result.dismiss === Swal.DismissReason.cancel) {
                logoutNoAlert();
            }
        });
    } else if(err.response?.status === 555) {
        Swal.fire({
            title: "Type Error",
            text: "The server encountered an issue trying to read an attribute from the http response. Would you like to continue or logout?",
            icon: "warning",
            confirmButtonColor: "#ffc107",
            confirmButtonText: "Continue",
            showCancelButton: true,
            cancelButtonText: "Logout",
            allowOutsideClick: false,
        }).then((result) => {
            if(result.dismiss === Swal.DismissReason.cancel) {
                logoutNoAlert();
            }
        });
    } else {
        Swal.fire({
            title: "Server Error",
            text: "The server encountered an error. Please logout and try again.",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "Logout",
            showCancelButton: false,
            allowOutsideClick: false
        }).then((result) => {
            if(result.isConfirmed) {
                logoutNoAlert();
            }
        });
    }
}

function logout() {
    store.commit("pushNotificationToast", {
        type: "warning",
        message: "Your session has expired. Please login again.",
        timeout: 30000,
        dismissible: true
    });
    store.commit("logout");
    router.push("/login");
}

function logoutNoAlert() {
    post("/logout", {}).then(() => {
        store.commit("logout");
        router.push("/login");
    });
}

// async function refreshToken() {
//     try {
//         return await axios.get(`${store.state.config.apiUrl}/status/whoami`);
//     } catch (err: any) {
//         if (err.response && err.response?.status === 401) {
//             return await axios.get(`${store.state.config.apiUrl}/refresh-token`);
//         } else {
//             throw err;
//         }
//     }
// }

export function get<T = unknown>(route: string, requestHeaders: any = {}, apiEndpoint?: string, skipErrHandle?: boolean) {
    const root = apiEndpoint ? apiEndpoint : store.state.config.api_v1;
    const url = `${root}${route}`;
    const headers = buildSecurityHeaders(requestHeaders);

    return new Promise<AxiosResponse<T>>((accept, reject) => {
        axios.get<T>(url, { headers })
            .then((res) => {
                accept(res);
            })
            .catch((err) => {
                if(skipErrHandle) {
                    reject(err);
                } else {
                    reject(errorResolver(err));
                }
            });
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function post<T = unknown>(route: string, payload: any, requestHeaders: any = {}, apiEndpoint?: string, skipErrHandle?: boolean) {
    const root = apiEndpoint ? apiEndpoint : store.state.config.api_v1;
    const url = `${root}${route}`;
    const headers = buildSecurityHeaders(requestHeaders);

    return new Promise<AxiosResponse<T>>((accept, reject) => {
        axios.post<T>(url, payload, { headers })
            .then((res) => {
                accept(res);
            })
            .catch((err) => {
                if(skipErrHandle) {
                    reject(err);
                } else {
                    reject(errorResolver(err));
                }
            });
    });
}

export async function postFormData(route:string, formData:FormData, apiEndpoint?: string) {
    const root = apiEndpoint ? apiEndpoint : store.state.config.api_v1;
    const url = `${root}${route}`;

    const res = await axios({
        url: url,
        method: "POST",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*"
        }
    }).then((response)=>{ return response; }).catch((error)=>{ return error; });

    return res;
}


export async function getJobs(): Promise<JobSummary[]> {
    const res = await get<JobSummaryResponse>("/jobs");
    return res.data.jobs.map(({ id, status, start, jobType }) => ({
        id, status,
        start: new Date(start),
        jobType
    }));
}

function loadLogItem({ type, timestamp, message, level }: LogItemResponse): TaskLogItem {
    return {
        type, message, level,
        timestamp: new Date(timestamp),
    };
}
export function loadTask({ title, start, end, status, log, progress, progressMax, progressLabel }: TaskResponse): Task {
    const task: Task = {
        title, status, progress,
        start: new Date(start),
        log: log.map(loadLogItem)
    };
    if(end) { task.end = new Date(end); }
    task.progressMax = progressMax === undefined ? 100 : progressMax;
    if(progressLabel) { task.progressLabel = progressLabel; }
    return task;
}
export function loadJob({ title, id, createdBy, jobType, status, start, end, tasks, attachments }: APIJobResponse): APIJob {
    const job: APIJob = {
        title,
        id,
        createdBy,
        jobType,
        status,
        start: new Date(start),
        tasks: tasks.map(loadTask)
    };
    if(end) { job.end = new Date(end); }
    if(attachments) { job.attachments = JSON.parse(attachments); }
    console.log(job);
    return job;
}
export async function getJob(jobId: string): Promise<APIJob> {
    return get<APIJobResponse>(`/jobs/${jobId}`).then((res) => loadJob(res.data));
}

export async function hasJob(id: string): Promise<boolean> {
    return axios.head(`/jobs/${id}`)
        .then(() => true)
        .catch(() => false);
}
