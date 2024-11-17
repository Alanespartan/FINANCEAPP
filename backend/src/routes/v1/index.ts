import { Router } from "express";
import { requiresAuth } from "@backend/middleware/requiresAuth";

import authRouter    from "./auth";
import serversRouter from "./servers";

import statusRouter  from "./status";
import jobRouter     from "./jobs";

import cardsRouter   from "./cards";

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


// Cards
v1Router.use("/cards",
    requiresAuth,
    cardsRouter
);


export default v1Router;
