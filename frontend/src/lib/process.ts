import { get } from "../api";
import store from "../store";

async function getProjects() {
    return { };
}

export async function getAllProjects() {
    const projects: any = await getProjects();
    const response = {
        rm: projects.rm
    };
    store.commit("pmmSetProjects", response);
    return response;
}

export async function getDNGProjects(...tools: string[]): Promise<any[]> {
    return get<{ projectAreas: any[]}>(`/dng/projects/?tools=${tools.join(",")}`)
        .then((res) => res.data.projectAreas);
}

export async function fetchModule(project: string, uri: string, context: string) {
    return get<{ module: any }>(`/dng/module?uri=${encodeURIComponent(uri)}`, { project, context }).then((res) => res.data.module);
}
