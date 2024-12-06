/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";

enum SessionDebugLevel {
    INFO  = 1,
    DEBUG = 2,
    TRACE = 3
}

const router = Router();

/**
* @swagger
* /api/v1/status:
*   get:
*       summary: Get APIS tatus
*       description: Get the status of the API.
*       tags:
*           - Status
*       responses:
*           200:
*               description: A JSON representation of the User object.
*               content:
*                   application/json:
*                       schema:
*                           type: object
*                           properties:
*                               status:
*                                   type: string
*                                   example: ok
*                               messages:
*                                   type: array
*                                   items:
*                                       type: string
*           400:
*               description: Bad Request Error
*/
router.get("/", (_, res) => {
    const health = {
        status: "ok",
        messages: [],
    };
    res.setHeader("content-type", "application/json");
    return res.status(200).json(health);
});

/**
* @swagger
* /api/v1/status/whoami:
*   get:
*       summary: Logged user info
*       description: Get information about the logged in user.
*       tags:
*           - Status
*       responses:
*           200:
*               description: A JSON representation of the User object.
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/IUser"
*           400:
*               description: Bad Request Error
*/
router.get("/whoami", async (req, res) => {
    const obj: Record<string, any> = {};
    if(req.userData) {
        obj.userData = req.userData;
    }
    return res.status(200).json(obj);
});

router.post("/logs-level", async (req, res) => {
    if(req.body.level) {
        const level = req.body.level;
        if(level === SessionDebugLevel.INFO)       { console.log("Updating Logs Level"); }
        else if(level === SessionDebugLevel.DEBUG) { console.log("Updating Logs Level"); }
        else if(level === SessionDebugLevel.TRACE) { console.log("Updating Logs Level"); }
        return res.json({ status: "ok" });
    }
    return res.status(400).json({ status: "error", message: "Could not update logs level." });
});

export default router;
