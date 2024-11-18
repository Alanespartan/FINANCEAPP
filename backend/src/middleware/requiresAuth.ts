import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@errors";
import { ConnectionStore } from "@backend/session/connectionStore";
import { clearSession } from "@backend/routes/v1/auth/functions";

/**
 * Session IDs that are blacklisted.
 */
export const blacklistedSessionIDs: string[] = [];

/**
 * Guard middleware for stopping unauthorized access to certain endpoints.
 * @param  {Request} req Express request.
 * @param  {Response} _res Express response.
 * @param  {NextFunction} next Express next function.
 * @throws UnauthorizedError Token is not authenticated.
 */
export async function requiresAuth(req: Request, _res: Response, next: NextFunction) {
    if(!req.session.isValidUser) {
        return next(new UnauthorizedError("You need to be logged in with a valid session to access this content."));
    }

    if(!ConnectionStore.hasConnection(req.sessionID)) { // Need to verify it exists since is needed to clearSession
        return next(new UnauthorizedError("Your session has been cleared. Please logout and login again."));
    }

    if(blacklistedSessionIDs.includes(req.sessionID)) {
        await clearSession(req);
        return next(new UnauthorizedError("Your session has been blacklisted. Please login again."));
    }

    // Check how to avoid thius since hasConnection already validated it exist
    const userData = ConnectionStore.getConnection(req.sessionID);
    if(!userData) {
        next(new UnauthorizedError("Your session has been cleared. Please logout and login again."));
    } else {
        req.userData = userData;
        next();
    }
}
