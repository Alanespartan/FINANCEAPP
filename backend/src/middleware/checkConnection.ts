import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@errors";
import { ConnectionStore } from "src/session/connectionStore";
import { clearSession } from "src/session/util";

export const blacklistedSessionIDs: string[] = [];

export async function requireSession(req: Request, _res: Response, next: NextFunction) {
    try {
        if(!req.session.finance) {
            throw new UnauthorizedError("You need to be logged in with a valid session to access this content.");
        }

        if(!ConnectionStore.hasConnection(req.sessionID)) {
            throw new UnauthorizedError("Your session has been cleared. Please logout and login again.");
        }

        if(blacklistedSessionIDs.includes(req.sessionID)) {
            await clearSession(req);
            throw new UnauthorizedError("Your session has been blacklisted.");
        }

        req.financeConnection = true;
        next();
    } catch(error){ 
        next(error);
    }
}