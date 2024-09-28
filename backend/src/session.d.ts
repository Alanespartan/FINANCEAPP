/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request } from "express";
import type { SessionData } from "express-session";
import { User } from "@backend/session/user";

declare global {
    namespace Express {
        // Inject additional properties on express.Request
        // e.g req.dbConnection
        interface Request {
            /**
             * The current user's connection.
             * NOTE: This is only present on routes using the `requiresELM` middleware.
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
