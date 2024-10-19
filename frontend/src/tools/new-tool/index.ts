import { defineTool } from "../util";

const version = "1.0";

export default defineTool({
    // name: Tool's name
    // id: A shorthand name or abbreviation for the tool
    // description: Description of the tool.
    // priority: Determines the popularity of the tool, and displays the top 2 tools on the homepage. Determined by user clicks
    // routes: All routes associated with the tool (including the homepage)
    // inDevelopment: Is the tool ready to be displayed in production server?
    name: "Example Tool",
    version: version,
    id: "NEW",
    description: "An example description for an example tool.",
    priority: 0,
    mvpCompleted: false, // tool is not usable
    inDevelopment: true, // since it's still in development
    routes: [
        {
            path: "/tools/NEW",
            name: "Example Tool" + " v" + version,
            component: () => import("./pages/index.vue"),
            meta: {
                authRequired: true,
            }
        }
    ]
});
