/* eslint-disable @typescript-eslint/no-explicit-any */
import { URL } from "url";
import type { HTTPRequestHeaders, HTTPRequestOptions } from "@common/types/axios";
import { Session } from "./Session";
import { HTTPPromise } from "./HTTPPromise";
import { Method } from "axios";

interface RequestBuilderMap {
    // "xml": XMLDocument,
    "json": any;
    "default": string;
}

export class RequestBuilder<T extends keyof RequestBuilderMap> {
    private options: HTTPRequestOptions & { params: { key: string, value: string }[], headers: HTTPRequestHeaders } = {
        params: [ ],
        headers: { }
    };

    public constructor(
        private readonly session: Session,
        private readonly method: Method,
        private readonly url: string | URL,
        private type: T
    ) { }

    private toType<T extends keyof RequestBuilderMap>(type: T): RequestBuilder<T> {
        const builder = new RequestBuilder(this.session, this.method, this.url, type);
        builder.options = this.options;
        return builder;
    }

    public send(): HTTPPromise<RequestBuilderMap[T]>;
    public send(body: string): HTTPPromise<RequestBuilderMap[T]>;
    public send(body?: string) {
        if(body) { this.options.body = body; }
        const p = this.session.request(this.method, this.url, this.options);
        switch (this.type) {
            // case "xml": return p.parseXML();
            case "json": return p.parseJSON();
            default: return p;
        }
    }

    /*
    public sendXML(doc: XMLDocument, contentType?: string): HTTPPromise<RequestBuilderMap[T]> {
        this.setHeader("Content-Type", contentType || "application/xml");
        return this.send(doc.toXMLSting());
    }
    */
    public sendJSON(obj: any): HTTPPromise<RequestBuilderMap[T]> {
        this.setHeader("Content-Type", "application/json");
        return this.send(JSON.stringify(obj));
    }
    public sendForm(params: Record<string, string | number | boolean>): HTTPPromise<RequestBuilderMap[T]> {
        this.setHeader("Content-Type", "application/x-www-form-urlencded");
        const body = Object.entries(params)
            .map(([ key, value ]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&");
        return this.send(body);
    }

    public setHeader(header: string, value: string) {
        this.options.headers[header] = value;
        return this;
    }

    public addParam(key: string, value: string) {
        this.options.params.push({ key, value });
        return this;
    }
    public setBody(body: string) {
        this.options.body = body;
        return this;
    }

    public accept(mime_type: string) { return this.setHeader("Accept", mime_type); }
    //public acceptXML() { return this.accept("application/xml").toType("xml"); }
    //public acceptRDF() { return this.accept("application/rdf+xml").toType("xml"); }
    public acceptJSON() { return this.accept("application/json").toType("json"); }

    public context(context: string, asQuery = false) {
        return asQuery ?
            this.addParam("oslc_config.context", context) :
            this.setHeader("oslc_config.context", context);
    }
    public oslc() { return this.setHeader("OSLC-Core-Version", "2.0"); }
}
