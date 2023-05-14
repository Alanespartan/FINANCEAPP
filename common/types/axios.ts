export type HTTPRequestHeaders = Record<string, string>;
export type HTTPRequestOptions = {
    params?: { [query: string]: string } | { key: string, value: string }[],
    headers?: HTTPRequestHeaders,
    body?: string
}