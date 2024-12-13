/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@errors";
import { Request } from "express";

export type HeaderOption<H extends string> = H | [H, string];

/**
* Helper to validate and cast query parameters. Handles type conversion for query parameters since req.query always contains strings or undefined.
* @param  {any} param Param type object from req object.
* @param  {boolean | string | number} type Expected type of query parameter
* @param  {string} name Name of query parameter
* @throws BadRequestError if the value doesn't match the expected type
* @returns Object containing headers.
*/
export function validateQueryParams(param: any, type: "boolean" | "string" | "number", name: string) {
    if(param === undefined) return undefined;
    if(type === "boolean") {
        if(param === "true")  return true;
        if(param === "false") return false;
        throw new BadRequestError(`Invalid format for '${name}' query param, expected boolean.`);
    }
    if(type === "number") {
        const parsed = Number(param);
        if(!isNaN(parsed)) return parsed;
        throw new BadRequestError(`Invalid format for '${name}' query param, expected number.`);
    }
    return String(param); // Default to string
}

/**
 * Gets headers from a request.
 * @param  {Request} req Request containing headers.
 * @param  {HeaderOption<H>[]} ...options Header options.
 * @throws BadRequestError Header is not present.
 * @returns Object containing headers.
 */
export function getHeaders<H extends string>(req: Request, ...options: HeaderOption<H>[]): Record<H, string> {
    return Object.fromEntries(options.map((opt) => {
        const header = typeof opt === "string" ? opt : opt[0];
        const value = req.get(header);
        if(!value) {
            const errMsg = typeof opt === "string" ? `Expected header '${opt}'` : opt[1];
            throw new BadRequestError(errMsg);
        }
        return [ header, value ];
    })) as Record<H, string>;
}

export function validateRequestBody(body: any, expected: { propName: string, type: string }[]): boolean {
    if(typeof body !== "object"
    || Object.keys(body).length === 0)      { throw new BadRequestError("No body was sent."); }
    expected.forEach((prop) => {
        if(Object.prototype.hasOwnProperty.call(body, prop.propName)) {
            if(prop.type !== "undefined") // This code doesn't support validation for string[], Map<any, any>, FormData so these are required in the body but we can't check its type
                if(typeof body[prop.propName] !== prop.type) { throw new BadRequestError(`Expected '${prop.propName}' field to be a ${prop.type}.`); }
        } else {
            throw new BadRequestError(`Expected '${prop.propName}' field was not send in the body request.`);
        }
    });
    return true;
}

export function validateRequestParams(params: any, expected: string[]): boolean {
    if(typeof params !== "object"
    || Object.keys(params).length === 0)      { throw new BadRequestError("No parameters were sent."); }
    expected.forEach((param) => {
        if(!Object.prototype.hasOwnProperty.call(params, param)) {
            throw new BadRequestError(`Expected '${param}' parameter was not send in the request.`);
        }
    });
    return true;
}
