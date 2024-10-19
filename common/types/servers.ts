export interface InstanceEndpoint {
    id: string;
    name: string;
}

export interface Server {
    id: string,
    name: string,
    url: string;
    location: "uk" | "us";
    endpoints: InstanceEndpoint[];
}
