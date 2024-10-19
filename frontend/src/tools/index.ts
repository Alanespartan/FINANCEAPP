import type { RouteRecordRaw } from "vue-router";
import type { ToolConfig, ToolRoutePath, ToolRouteRecord } from "./util";
import nt  from "./new-tool";

// import tool, then put in the below array. Tool must be put in array regardless of if it's active or not.
// Tool "disabled" state is defined in the init page of the tool.
const toolConfigs: ToolConfig<string>[] = [
    nt
    // add your new tool here
];

for(const tool of toolConfigs) {
    const homepage = tool.homepage || `/tools/${tool.id}`;
    if(!tool.routes.some((r) => r.path === homepage)) {
        throw new ReferenceError(`Cannot initialize tool with homepage '${homepage}' with a defined route.`);
    }
}

export const tools = toolConfigs.map(createTool);
export const routes: RouteRecordRaw[] = tools.map((t) => t.routes).flat();

export interface Tool<T extends string> {
    /** Full name of the tool. */
    name: string,
    /** Version of the tool. */
    version: string,
    /** Short name/ID of the tool. Used to generate route endpoints. */
    id: T,
    /** Path for the tool's homepage, which must exist in `routes`. This defaults to '/tools/:toolId'. */
    homepage: ToolRoutePath<T>;
    /** Description of the tool. */
    description: string,
    /** Sort priority of the tool. Used to order the list of tools for the user. */
    priority: number,
    /** Routes and components the tool uses. */
    routes: ToolRouteRecord<T>[],
    /** Flag to check if there is pending development for the tool. */
    inDevelopment: boolean,
    /** Flag to check if the tool is ready to be displayed in production server. */
    mvpCompleted: boolean,
}

function createTool<T extends string>(config: ToolConfig<T>): ToolConfig<T> {
    return {
        name: config.name,
        version: config.version,
        id: config.id,
        homepage: config.homepage || `/tools/${config.id}` as ToolRoutePath<T>,
        description: config.description,
        priority: config.priority,
        routes: config.routes,
        inDevelopment: config.inDevelopment,
        mvpCompleted: config.mvpCompleted
    };
}
