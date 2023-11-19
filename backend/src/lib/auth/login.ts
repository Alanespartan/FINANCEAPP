import { RequestHandler } from "express";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "@errors";
import { ConnectionStore } from "@src/session/connectionStore";
import { LoginRequest } from "@common/types/auth";
import { userController } from "@src/session/user";

/**
 * Map from user email to number of bad login attempts.
 * Used to lock users out after a certain number of login attempts.
 */
const badLoginAttempts: Record<string, number> = {};
const MAX_LOGIN_ATTEMPTS = 5;
/**
 * Time the user has to wait after exceeding the maximum number of bad login attempts.
 * 5 minutes in milliseconds.
 */
const BAD_LOGIN_TIMEOUT = 5 * 60 * 1000;

/**
 * Ensures login body is in correct format and all required information is present.
 * @param {unknown} body Body from login request.
 * @returns bodyisLoginBody wheter or not the body is valid
 */
function verifyLoginBody(body: unknown): body is LoginRequest {
    return typeof body === "object" && body !== null
        && typeof(body as LoginRequest).email    === "string"
        && typeof(body as LoginRequest).password === "string"
}

/**
 * Handle the login request
 */
export const handleLoginRequest: RequestHandler = async (req, res) => {
    if(!verifyLoginBody(req.body)) throw new BadRequestError("Malformed login body sent.");

    const email = req.body.email;
    const password = req.body.password;

    if(badLoginAttempts[email] >= MAX_LOGIN_ATTEMPTS) throw new ForbiddenError(`Too many login attempts for ${email}.`)

    const foundUser = userController.get(email);

    if(foundUser) {
        if(foundUser.password === password) {
            req.session.userData = foundUser;
            ConnectionStore.setConnection(req.sessionID, foundUser.id);
            return res.status(200).json({ status: "login successful" });
        } else {
            if(badLoginAttempts[email]) {
                badLoginAttempts[email] += 1;
            } else {
                badLoginAttempts[email] = 1;
            }
            if(badLoginAttempts[email] >= MAX_LOGIN_ATTEMPTS) {
                setTimeout(() => {
                    delete badLoginAttempts[email];
                }, BAD_LOGIN_TIMEOUT);
                throw new ForbiddenError(`Too many login attempts for ${email}. Try again in 5 minutes.`);
            }
        }
    }
    throw new UnauthorizedError("Incorrect credentials were given. Please check credentials and try again.");
}