import { ClientRequest } from "http";
import { AxiosResponseHeaders, AxiosResponse, AxiosRequestConfig } from "axios";

export class HTTPResponse<T> implements AxiosResponse<T> {
    public constructor(
        public readonly location: string,
        public readonly status: number,
        public readonly statusText: string,
        public readonly headers: AxiosResponseHeaders,
        public readonly data: T,
        public readonly request: ClientRequest,
        public readonly config: AxiosRequestConfig<any>,
    ) { }
    public static fromAxios<T>(res: AxiosResponse<T>){
        return new HTTPResponse(
            res.request?.host + res.request?.path,
            res.status,
            res.statusText,
            res.headers,
            res.data,
            res.request,
            res.config
        );
    }
    public static mapAxios<T, U>(res: AxiosResponse<T>, mapFn: (res: AxiosResponse<T>) => U) {
        return new HTTPResponse(
            res.request?.host + res.request?.path,
            res.status,
            res.statusText,
            res.headers,
            mapFn(res),
            res.request,
            res.config
        );
    }
    /** Returns whether this response has a successful response code (i.e 2XX) */
    public isSuccess()  { return this.status >= 200 && this.status < 300 }
    /** Returns whether this response has a non-error response code (i.e 1XX, 2XX or 3XX) */
    public isComplete() { return this.status < 400 }

    /** Returns parsed body according to given function
     * @param {Function} funct Given function to parse body request
    */
    public parseBody<U>(parseFn: (body: T) => U): HTTPResponse<U> {
        return new HTTPResponse(
            this.location,
            this.status,
            this.statusText,
            this.headers,
            parseFn(this.data),
            this.request,
            this.config
        );
    }

    public static parseJSON(res: HTTPResponse<string>) {
        return res.parseBody(JSON.parse);
    }
}