import { Response } from "express";
import { RequestError, ErrorResponse, ResMessage } from "@common/types/errors";

/**
 * Sends the error as a HTTP response with a code, message and information.
 * @param {RequestError} err Error thrown.
 * @param {Response} res Express response object.
 */
export function sendError(err: RequestError, res: Response) {
    const response: ErrorResponse = { status: "error", message: err.resMessage.message, info: err.resMessage.info };
    return res.status(err.code).json(response);
}

export class GeneralError extends Error implements RequestError {
    constructor(
        message: string,
        public readonly code: number,
        public readonly resMessage: ResMessage
    ) {
        super(message);
    }
}

/**
 * @param {string} message General message the error should display
 * @param {number} code Error code (HTTP response code)
 * @return A new error class that extends the GeneralError class.
 */
function makeErrorClass(message: string, code: number) {
    return class extends GeneralError {
        public constructor(info: string) { super(message, code, { info, message }); }
    }
}

/* Client Errors */
export const BadRequestError =   makeErrorClass("The server did not understand the request or could not read the request body.", 400);
export const UnauthorizedError = makeErrorClass("You need to be logged in to view this resource.", 401);
export const ForbiddenError =    makeErrorClass("You're not authorized to view this resource.", 403);
export const NotFoundError =     makeErrorClass("The requested resource could not be found.", 404);
export const ResourceGoneError = makeErrorClass("The requested resource was previously in use but is no longer available and will not be available again.", 410);
/* Server Errors */
export const ServerError =       makeErrorClass("A server error occured while trying to process your request.", 500);
export const TypeScriptError =   makeErrorClass("A typescript error occured while trying to process your request.", 555);
export const HTTPError =         makeErrorClass("Dummy class TODO create real http error class.", 555);