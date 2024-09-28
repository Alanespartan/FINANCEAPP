/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { HTTPError, UnexpectedStatusError } from "@errors";
import { HTTPResponse } from "./HTTPResponse";

type PromiseResult<T> = T | PromiseLike<T>;
type PromiseFn<I, T>  = ((value: I) => PromiseResult<T>) | undefined | null;

export class HTTPPromise<T> extends Promise<HTTPResponse<T>> {
    public static fromPromise<T>(p: Promise<HTTPResponse<T>>): HTTPPromise<T> {
        return new HTTPPromise((resolve, reject) => p.then(resolve, reject));
    }

    public static fromAxios<T>(p: Promise<AxiosResponse<T>>): HTTPPromise<T> {
        return new HTTPPromise((resolve, reject) => p.then((res) => resolve(HTTPResponse.fromAxios(res)), reject));
    }

    public filterStatus(status: number) {
        return this.thenAny((res) => {
            if(res.status === status) { return res; }
            else { throw new UnexpectedStatusError(status, res.status, res); }
        });
    }

    public filterComplete() {
        return this.thenAny((res) => {
            if(res.isComplete()) { return res; }
            else { throw new HTTPError(`HTTP Error Response Code ${res.status}.`, res.status, res); }
        });
    }

    public thenBody<TResult, EResult = never>(onfulfilled: (body: T, res: HTTPResponse<T>) => PromiseResult<TResult>, onrejected?: PromiseFn<any, EResult>) {
        return this.then((res) => onfulfilled(res.data, res), onrejected);
    }

    public thenStatus<TResult, EResult = never>(status: number, onfulfilled: (body: T, res: HTTPResponse<T>) => PromiseResult<TResult>, onrejected?: PromiseFn<any, EResult>) {
        return this.filterStatus(status).then((res) => onfulfilled(res.data, res), onrejected);
    }

    public thenAny<TResult>(onfulfilled: (res: HTTPResponse<T>) => PromiseResult<TResult>) {
        return this.catch((err) => {
            if(err instanceof HTTPError) { return HTTPResponse.fromAxios(err.res); }
            throw err;
        }).then(onfulfilled);
    }

    public onFailure<EResult>(onrejected: PromiseFn<any, EResult>) {
        return this.filterComplete().catch(onrejected);
    }

    public parseResponse<U>(parseFn: (res: HTTPResponse<T>) => HTTPResponse<U>): HTTPPromise<U> {
        return this.then(parseFn) as HTTPPromise<U>;
    }

    public parseBody<U>(parseFn: (res: T) => U): HTTPPromise<U> {
        return this.then((res) => res.parseBody(parseFn)) as HTTPPromise<U>;
    }
}

export class BaseHTTPPromise extends HTTPPromise<string> {
    public parseJSON() {
        return this.parseResponse(HTTPResponse.parseJSON);
    }
}
