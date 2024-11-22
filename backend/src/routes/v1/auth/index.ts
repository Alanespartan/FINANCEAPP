import { Router } from "express";
import { ConnectionStore } from "@backend/session/connectionStore";
import { userController } from "@backend/lib/entities/userController";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "@errors";
import { clearSession, verifyLoginBody } from "./functions";

const router = Router();

const MAX_LOGIN_ATTEMPTS = 5;
/**
 * Map from user email to number of bad login attempts.
 * Used to lock users out after a certain number of login attempts.
 */
const badLoginAttempts: Record<string, number> = {};
/**
 * Time the user has to wait after exceeding the maximum number of bad login attempts.
 * 5 minutes in milliseconds.
 */
const BAD_LOGIN_TIMEOUT = 5 * 60 * 1000;

/**
* @swagger
* /api/v1/login:
*   post:
*       summary: Login to Express App
*       description: Stablish connection against ELM Servers and create Express App session.
*       tags:
*           - Auth
*       requestBody:
*           description: Payload that includes user, password, server, tool parameters.
*           required: true
*           content:
*               application/json:
*                   schema:
*                       type: object
*                       properties:
*                           email:
*                               type: string
*                               example: test@gmail.com
*                           password:
*                               type: string
*                               example: admin
*                       required:
*                           - email
*                           - password
*       responses:
*           200:
*               description: A successful login
*           400:
*               description: Bad Request Error
*           401:
*               description: Unauthorized Error
*           403:
*               description: Forbidden Error
*           500:
*               description: Internal server error
*/
router.post("/login", async (req, res, next) => {
    try {
        if(!verifyLoginBody(req.body)) throw new BadRequestError("Malformed login body sent.");

        const email    = req.body.email;
        const password = req.body.password;

        const foundUser = userController.getByEmail(email);
        if(!foundUser) throw new UnauthorizedError("User does not exist. Please check credentials and try again.");

        if(foundUser.password !== password) {
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

        // TODO UPDATE CACHE STORAGE to reduce timing between requests
        // e.g:
        // req.session.cache.users
        req.session.isValidUser = true;

        ConnectionStore.setConnection(req.sessionID, foundUser); // req.session.id is an alias of req.sessionID
        return res.sendStatus(200);
    } catch(error) { next(error); }
});

/**
* @swagger
* /api/v1/logout:
*   post:
*       summary: Logs out a user of Express App
*       description: Delete connection from connection store and clear express request session.
*       tags:
*           - Auth
*       responses:
*           200:
*               description: A successful log out
*           500:
*               description: There was an unexpected server error trying to log out
*/
router.post("/logout", async (req, res, next) => {
    try {
        ConnectionStore.deleteConnection(req.sessionID);
        await clearSession(req);
        return res.status(200).json({ status: "success" });
    } catch(error) { next(error); }
});

export default router;
