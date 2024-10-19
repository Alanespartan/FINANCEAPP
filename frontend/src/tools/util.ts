/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RouteComponent } from "vue-router";

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
export type CheckForUnion<T, TErr, TOk> = [T] extends [UnionToIntersection<T>] ? TOk : TErr
export type SingleStringLiteral<T> = T & CheckForUnion<T, never, string>;

export type ToolRoutePath<T extends string> = `/tools/${T & SingleStringLiteral<T>}` | `/tools/${T & SingleStringLiteral<T>}/${string}`;
export interface ToolRouteRecord<T extends string> {
    path: ToolRoutePath<T>;
    name: string;
    component: RouteComponent;
    meta: Record<string, unknown>
}

export interface ToolConfig<T extends string> {
    /** Full name of the tool. */
    name: string,
    /** Version of the tool. */
    version: string,
    /** Short name/ID of the tool. Used to generate route endpoints. */
    id: T,
    /** Path for the tool's homepage, which must exist in `routes`. This defaults to '/tools/:toolId'. */
    homepage?: ToolRoutePath<T>;
    /** Description of the tool. */
    description: string,
    /** Sort priority of the tool. Used to order the list of tools for the user. */
    priority: number,
    /** Routes and components the tool uses. */
    routes: ToolRouteRecord<T>[],
    /** Flag to check if there is pending development for the tool. */
    inDevelopment: boolean,
    /** Flag to check if the tool is ready to be displayed in production server. */
    mvpCompleted: boolean
}

/**
 * Define a tool. This tool doesn't actually do anything, but supports typing the given config object.
 */
export function defineTool<T extends string>(config: ToolConfig<T>): ToolConfig<T> {
    return config;
}
