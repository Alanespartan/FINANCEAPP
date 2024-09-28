/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";

enum SessionDebugLevel {
    INFO  = 1,
    DEBUG = 2,
    TRACE = 3
}

const router = Router();

/**
 * @api {get} /api/v1/status Get the status of the API.
 * @apiName GetAPIStatus
 * @apiGroup Status
 *
 * @apiSuccess (Success) {Object[]} status
 * @apiSuccess (Success) {String} servers.status Status of the API.
 * @apiSuccess (Success) {String[]} servers.messages Information important to the user (new versions, downtime, etc.)
 */
router.get("/", (_, res) => {
    const health = {
        status: "ok",
        messages: [],
    };
    res.setHeader("content-type", "application/json");
    return res.send(health);
});

/**
 * @api {get} /api/v1/status/whoami Get information about the logged in user.
 * @apiName GetWhoAmI
 * @apiGroup Status
 *
 * @apiError (User Errors) {Object} Unauthorized User is not logged in.
 */
router.get("/whoami", async (req, res) => {
    const obj: Record<string, any> = {};
    if(req.userData) {
        obj.userData = req.userData;
    }
    return res.json(obj);
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
