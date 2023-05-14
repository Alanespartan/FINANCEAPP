import { AgentOptions } from "https";
import { Url } from "url";

import axiosGlobal, { AxiosError, AxiosResponse, Method } from "axios";
import { HttpCookieAgent, HttpsCookieAgent, CookieAgentOptions } from "http-cookie-agent";
import { CookieJar } from "tough-cookie";

import { SessionError, AuthenticationError } from "@errors";
import { HTTPRequestOptions, HTTPRequestHeaders } from "@common/types/axios";
import { HTTPResponse } from "./HTTPResponse";
import { RequestBuilder } from "./RequestBuilder";
import { BaseHTTPPromise } from "./HTTPPromise";

import FormData from "form-data";

export type SessionOptions = AgentOptions & CookieAgentOptions;
export enum SessionDebugLevel {
    INFO = 3, DEBUG = 4, TRACE = 5
}

function createAxios(baseURL: string, agentOptions?: SessionOptions) {
    const jar = new CookieJar();
    const options: SessionOptions = {
        cookies: { jar },
        rejectUnauthorized: false,
        ...(agentOptions || {})
    };
    const httpAgent = new HttpCookieAgent(options);
    const httpsAgent = new HttpsCookieAgent(options);
    return axiosGlobal.create({
        httpAgent,
        httpsAgent,
        baseURL,
        withCredentials: true,
        transitional: {
            forcedJSONParsing: false
        },
        headers: {
            "User-Agent": "FINANCE-Agent/1.0"
        }
    });
}

export class Session {
    private readonly axios;
    public username = "";
    private password = "";

    public static LEVEL = SessionDebugLevel.INFO;

    /** A HTTPS session at the given server url */
    public constructor(
        public readonly baseUrl: string,
        agentOptions?: SessionOptions
    ) {
        this.axios = createAxios(baseUrl, agentOptions);
    }

    /** Request the given path using the given HTTP method */
    public request(method: Method, path: URL | string, options: HTTPRequestOptions): BaseHTTPPromise {
        const url = path instanceof URL ? path : new URL(path, this.baseUrl);

        if(options.params) {
            if(Array.isArray(options.params)) {
                options.params.forEach((param) => url.searchParams.append(param.key, param.value));
            } else {
                Object.entries(options.params).forEach(([ key, value ]) => url.searchParams.set(key, value));
            }
        }
        const headers: HTTPRequestHeaders = { };
        if(options.headers) { Object.assign(headers, options.headers); }

        if(Session.LEVEL >= SessionDebugLevel.INFO) console.log(method, url.toString(), headers);

        const p = this.axios.request<string, AxiosResponse<string>, string>({
            url: url.toString(),
            method,
            headers,
            auth: {
                username: this.username,
                password: this.password
            },
            data: options.body
        }).catch((err) => {
            if(err instanceof AxiosError) { throw SessionError.fromAxios(err); }
            throw err;
        });
        return new BaseHTTPPromise((resolve, reject) => p.then((res) => resolve(HTTPResponse.fromAxios(res)), reject));
    }

    public builder(method: Method, url: string | URL) { return new RequestBuilder(this, method, url, "default"); }
    public getBuilder(url: string | URL)    { return this.builder("GET",    url); }
    public deleteBuilder(url: string | URL) { return this.builder("DELETE", url); }
    public patchBuilder(url: string | URL)  { return this.builder("PATCH",  url); }
    public postBuilder(url: string | URL)   { return this.builder("POST",   url); }
    public putBuilder(url: string | URL)    { return this.builder("PUT",    url); }

    public postFormData(path: string | URL, payload: FormData): BaseHTTPPromise {
        const url = path instanceof URL ? path : new URL(path, this.baseUrl);
        const headers: HTTPRequestHeaders = { };
        headers["OSLC-Core-Version"] = "2.0";
        headers["Content-Type"] = "multipart/form-data";
        const p = this.axios.request<string, AxiosResponse<string>, FormData>({
            url: url.toString(),
            method: "POST",
            headers,
            auth: {
                username: this.username,
                password: this.password
            },
            data: payload
        }).catch((err) => {
            if(err instanceof AxiosError) { throw SessionError.fromAxios(err); }
            throw err;
        });
        return new BaseHTTPPromise((resolve, reject) => p.then((res) => resolve(HTTPResponse.fromAxios(res)), reject));
    }
}