import type { Request } from "express";
import type { SessionData } from "express-session";
import { UserSession } from "@common/types/auth";

declare global {
    namespace Express {
        // Inject additional property on express.Request
        interface Request {
            /**
             * The current user connection.
             * NOTE: This is only present on routes using the "checkConnection" middleware.
             */
            financeConnection: boolean
        }
    }
}
declare module "express-session" {
    interface SessionData {
        finance?: UserSession
    }
}