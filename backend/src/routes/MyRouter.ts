import { IRouter, RequestHandler, Router } from "express";
import { RouteParameters } from "express-serve-static-core";
import { ParsedQs } from "qs";

type RouteMethod = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head";

export class MyRouter {
    private router: IRouter = Router();

    public getRouter() { return this.router; }

    public all     = this.wrapRouterMatcher("all");
    public get     = this.wrapRouterMatcher("get");
    public post    = this.wrapRouterMatcher("post");
    public put     = this.wrapRouterMatcher("put");
    public delete  = this.wrapRouterMatcher("delete");
    public patch   = this.wrapRouterMatcher("patch");
    public options = this.wrapRouterMatcher("options");
    public head    = this.wrapRouterMatcher("head");

    public use = this.router.use.bind(this.router);

    private wrapRouterMatcher<T extends RouteMethod>(method: T) {
        return <
            Path extends string,
            P = RouteParameters<Path>,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>
        >(path: Path, ...handlers: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>[]) => {
            this.router[method](path, ...handlers.map(wrapRequestHandler));
            return this;
        };
    }
}

function wrapRequestHandler<
    P = RouteParameters<string>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    Locals extends Record<string, any> = Record<string, any>
>(handler: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {
    return (req, res, next) => {
        const hres = handler(req, res, next) as any;
        if(hres instanceof Promise) {
            hres.catch((err) => next(err));
        }
    }
}