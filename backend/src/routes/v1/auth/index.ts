import { Router } from "express";
import { ConnectionStore } from "@backend/session/connectionStore";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "@errors";
import { clearSession, verifyLoginBody, verifySignUpBody } from "./functions";
import userController from "@backend/lib/entities/users/userController";

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
*       description: Use credentials to validate the user has a valid account registered in the app server database.
*       tags:
*           - Auth
*       requestBody:
*           description: Payload that includes user email and password to perform a log in operation.
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: "#/components/schemas/LoginPayload"
*       responses:
*           200:
*               description: A successful login
*           400:
*               description: Bad Request Error
*           401:
*               description: Unauthorized Error
*           403:
*               description: Forbidden Error
*/
router.post("/login", async (req, res, next) => {
    try {
        if(!verifyLoginBody(req.body)) {
            throw new BadRequestError("Malformed login body sent.");
        }

        const email    = req.body.email;
        const password = req.body.password;

        const foundUser = await userController.getByEmail(email);
        if(!foundUser) {
            throw new UnauthorizedError("User does not exist. Please check credentials and try again.");
        }

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
*       summary: Logs out a user
*       description: Delete connection from connection store and clear express request session.
*       tags:
*           - Auth
*       responses:
*           200:
*               description: A successful log out
*           500:
*               description: Server Error
*/
router.post("/logout", async (req, res, next) => {
    try {
        ConnectionStore.deleteConnection(req.sessionID);
        await clearSession(req);
        return res.status(200).json({ status: "success" });
    } catch(error) { next(error); }
});

/**
* @swagger
* /api/v1/signup:
*   post:
*       summary: Sign Up
*       description: Create a new account in the database from the given payload.
*       tags:
*           - Auth
*       requestBody:
*           description: Payload that includes all required attributes to create a new user account.
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: "#/components/schemas/SignUpPayload"
*       responses:
*           200:
*               description: A successful login
*           400:
*               description: Bad Request Error
*/
router.post("/signup", async (req, res, next) => {
    try {
        if(!verifySignUpBody(req.body)) {
            throw new BadRequestError("Malformed sign up body sent.");
        }

        userController.create("test@gmail.com", "admin", "John", "Doe");

        return res.sendStatus(200);
    } catch(error) { next(error); }
});

export default router;
