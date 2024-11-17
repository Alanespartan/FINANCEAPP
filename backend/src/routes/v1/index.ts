import { Router } from "express";
import jobRouter        from "./jobs";
import statusRouter     from "./status";
import serversRouter    from "./servers";
import authRouter       from "./auth";
import { requiresAuth } from "@backend/middleware/auth";

const v1Router = Router();

/** NO AUTH REQUIRED **/
// Auth
v1Router.use("/", authRouter);

// Servers
v1Router.use("/servers", serversRouter);

/** AUTH REQUIRED */
// Server Status
v1Router.use("/status",
    requiresAuth,
    statusRouter
);

// Job Status
v1Router.use("/jobs",
    requiresAuth,
    jobRouter
);

export default v1Router;
