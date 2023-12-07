import type { Request } from "express";
import type { SessionData } from "express-session";
import { User } from "@src/session/user";

declare global {
    namespace Express {
        // Inject additional property on express.Request
        interface Request {
            /**
             * The current user connection.
             * NOTE: This is only present on routes using the "checkConnection" middleware.
             */
            userData: User
        }
    }
}
declare module "express-session" {
    interface SessionData {
        isValidUser?: boolean
    }
}