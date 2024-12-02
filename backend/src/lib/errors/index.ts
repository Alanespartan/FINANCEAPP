/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
import { AxiosError } from "axios";
import {
    RequestError,
    ErrorResponse,
    ResMessage
} from "@common/types/errors";
import { HTTPResponse } from "../axios/HTTPResponse";

/* General Errors */
export class GeneralError extends Error implements RequestError {
    constructor(
        message: string,
        public readonly code: number,
        public readonly resMessage: ResMessage
    ) {
        super(message);
    }
}

/* HTTP Errors */
export class AuthenticationError extends Error { }
export class SessionError extends Error {
    public constructor(
        message: string,
        public readonly data?: any
    ) {
        super(message);
    }
    public static fromAxios(err: AxiosError) {
        if(err.response) {
            return new HTTPError(err.message, err.response.status, HTTPResponse.fromAxios(err.response));
        } else if(err.request) {
            return new IRequestError(err.message, err);
        } else {
            return new SessionError(err.message, err);
        }
    }
}
export class IRequestError extends SessionError { }
export class HTTPError extends SessionError {
    public constructor(
        message: string,
        public readonly status: number,
        public readonly res: HTTPResponse<any>
    ) {
        super(message);
    }
}
export class UnexpectedStatusError extends HTTPError {
    public constructor(
        public readonly expectedStatus: number,
        public readonly actualStatus: number,
        res: HTTPResponse<any>
    ) {
        super(`Expected status code '${expectedStatus}', but found '${actualStatus}'`, actualStatus, res);
    }
}

/* Client Errors */
export const BadRequestError   = makeErrorClass("The server did not understand the request or could not read the request body.", 400);
export const UnauthorizedError = makeErrorClass("You need to be logged in to view this resource.", 401);
export const ForbiddenError    = makeErrorClass("You are not authorised to view this resource.", 403);
export const NotFoundError     = makeErrorClass("The requested resource could not be found.", 404);
export const ResourceGoneError = makeErrorClass("The requested resource was previously in use but is no longer available and will not be available again.", 410);
/* Server Errors */
export const ServerError     = makeErrorClass("A server error occurred while trying to process your request.", 500);
export const TypeScriptError = makeErrorClass("A typescript error occurred while trying to process your request.", 500);
export const HTTPSError      = makeErrorClass("Dummy class TODO create real http error class.", 555);

/**
 * Sends the error as a HTTP response with a code, message and information.
 * @param  {RequestError} err Error thrown.
 * @param  {Response} res Express response object.
 */
export function sendError(err: RequestError, res: Response) {
    const response: ErrorResponse = { status: "error", message: err.resMessage.message, info: err.resMessage.info };
    console.log(`Error code:    ${err.code}`);
    console.log(`Error message: ${response.message}`);
    console.log(`Error Info:    ${response.info}`);
    return res.status(err.code).json(response);
}

/**
 * Creates an error class.
 * @param  {string} message General message the error should display.
 * @param  {number} code Error code (HTTP response code)
 * @return A new error class that extends the GeneralError class.
 */
function makeErrorClass(message: string, code: number) {
    return class extends GeneralError {
        public constructor(info: string) { super(message, code, { info, message }); }
    };
}
