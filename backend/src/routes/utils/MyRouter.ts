/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRouter, RequestHandler, Router } from "express";
import { RouteParameters } from "express-serve-static-core";
import { ParsedQs } from "qs";

type RouteMethod = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head";

export class MyRouter
{
    private router: IRouter = Router();

    public getRouter() { return this.router; }

    /**
    * Converts Express 4 app routes to an array representation suitable for easy parsing.
    * @arg {Array} stack An Express 4 application middleware list.
    * @returns {Array} An array representation of the routes in the form [ [ 'GET', '/path' ], ... ].
    */
    public getRoutes(stack: any): Array<any> {
        const routes = (stack || [])
            // We are interested only in endpoints and router middleware.
            .filter((it: { route: any; name: string; }) => it.route || it.name === "router")
            // The magic recursive conversion.
            .reduce((result: any[], it: { route: { methods: any; path: any; }; handle: { stack: any; }; }) => {
                if(!it.route) {
                    // We are handling a router middleware.
                    const stack = it.handle.stack;
                    const routes = this.getRoutes(stack);
                    return result.concat(routes);
                }
                // We are handling an endpoint.
                const methods = it.route.methods;
                const path    = it.route.path;
                const routes = Object
                    .keys(methods)
                    .map((m) => [ m.toUpperCase(), path ]);
                return result.concat(routes);
            }, [])
            // We sort the data structure by route path.
            .sort((prev: [any, any], next: [any, any]) => {
                const [ , prevPath ] = prev;
                const [ , nextPath ] = next;

                if(prevPath < nextPath) return -1;
                if(prevPath > nextPath) return 1;

                return 0;
            });
        return routes;
    }

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
    };
}
