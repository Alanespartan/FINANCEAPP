import { Request, Response } from "express";
import { LoginRequest } from "@common/types/auth";
import { v4 as uuid } from "uuid";
import { ServerError } from "@errors";
import { environment } from "../../../app";

/**
 * Ensures login body is in correct format and all required information is present.
 * @param {unknown} body Body from login request.
 * @returns bodyisLoginBody wheter or not the body is valid
 */
export function verifyLoginBody(body: unknown): body is LoginRequest {
    return typeof body === "object" && body !== null
        && typeof(body as LoginRequest).email    === "string"
        && typeof(body as LoginRequest).password === "string";
}

const timeoutMinutes = 30;
/**
 * Builds a cookie to respond with.
 * @param  {Response} res Express response to tie cookie to.
 * @param  {string} token? User token to pack into the cookie.
 * @param  {number} timeoutMinutesOverride? Override cookie timeout (minutes).
 * @returns {string} token User token.
 */
export function buildCookie(res: Response, token?: string, timeoutMinutesOverride?: number): string {
    // cookie should only live for 30 minutes, refresh after each request.
    const expiration = new Date();
    if(timeoutMinutesOverride) {
        expiration.setMinutes(expiration.getMinutes() + timeoutMinutesOverride);
    } else {
        expiration.setMinutes(expiration.getMinutes() + timeoutMinutes);
    }

    if(!token) {
        // new random token, could possibly be a JWT?
        token = uuid();
    }

    let secure = true;
    if(environment === "development" || environment === "dev") {
        secure = false;
    }

    res.cookie("token", token, { expires: expiration, httpOnly: true, secure, sameSite: "strict" });

    return token;
}

export function clearSession(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
            if(err) {
                console.error("[logout] An error has occurred trying to logout");
                console.error(err);
                reject(new ServerError("There was an unexpected error trying to log out."));
            } else {
                resolve();
            }
        });
    });
}
