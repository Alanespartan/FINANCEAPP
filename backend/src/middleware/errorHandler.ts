import { NextFunction, Request, Response } from "express";
import { sendError, GeneralError, HTTPError, ServerError, UnauthorizedError, TypeScriptError, NotFoundError, ForbiddenError, ResourceGoneError } from "@errors";
import { Logger } from "@common/types/logger";

const logger = new Logger("middleware/errorHandler.ts");

/**
 * Handles errors thrown in the app.
 * @param {Error} err Error being thrown.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {NextFunction} next Express next function.
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    try {
        if(err instanceof GeneralError) {
            sendError(err, res);
        } else if(err instanceof HTTPError) {
            if(err.status === 401){
                sendError(new UnauthorizedError("Your request was unauthorized. Your session might have expired. Try logging out and back in then try again."), res);
            } else if(err.status === 403){
                sendError(new ForbiddenError("Your request was forbidden. An attempt was made to view a resource that you cannot see."), res);
            } else if(err.status === 404){
                sendError(new NotFoundError("Your request was not found. Your session attempted to fetch a resource that could not be found in the server."), res);
            } else if(err.status === 410){
                sendError(new ResourceGoneError("Your request was gone. Your session attempted to fetch a resource that is no longer available. Do not request the resource in the future."), res);
            } else {
                logger.error(`[${err.constructor.name}] ${err.message} (route: ${req.path})`);
                logger.error(`HTTP ${err.res.request.method} ${err.res.request.path})`);
            }
        } else if(err instanceof TypeError) {
            sendError(new TypeScriptError(err.message), res);
        } else {
            sendError(new ServerError("There was an unexpected server error."), res);
            logger.error(`[${err.constructor.name}] ${err.message} (route: ${req.path})`);
        }
    } catch(error) { next(error); }
}
