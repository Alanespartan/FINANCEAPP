import path from "path";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import express from "express";
// import { auth } from "express-openid-connect";
import session from "express-session";
import expressWs from "express-ws";
import fileupload from "express-fileupload";
import memoryStoreMaker from "memorystore";
import { Session, SessionDebugLevel } from "./lib/axios/Session";
// This loads path aliases from tsconfig.json
import "tsconfig-paths/register";
import { errorHandler } from "./middleware/errorHandler";
import { ConnectionStore } from "./session/connectionStore";
import * as cron from "node-cron";

const MemoryStore = memoryStoreMaker(session);

// TODO: separate these configs/dependencies out so all imports can go to the top.
// Config
if(process.env.NODE_ENV !== "production") {
    dotenv.config({
        path: path.resolve(__dirname, "..", "..", ".env")
    });
}
const app = express();
const webappPath = path.resolve(__dirname, "..", "..", "frontend", "dist");

expressWs(app);
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cookieParser());
app.use(fileupload());
// app.use(methodOverride());

/* CHECK ENV VARIABLES */
if(!process.env.NODE_ENV)   { throw new Error("Must provide a NODE_ENV environment variable"); }
if(!process.env.CIPHER_KEY) { throw new Error("Must provide a CIPHER_KEY environment variable"); }
if(!process.env.LOG_LEVEL)  { throw new Error("Must provide a LOG_LEVEL environment variable"); }
export const cipherKey = process.env.CIPHER_KEY;
export const environment = process.env.NODE_ENV;
export const desiredLogs = process.env.LOG_LEVEL;
if(desiredLogs === "info")       { Session.LEVEL = SessionDebugLevel.INFO; }
else if(desiredLogs === "debug") { Session.LEVEL = SessionDebugLevel.DEBUG; }
else if(desiredLogs === "trace") { Session.LEVEL = SessionDebugLevel.TRACE; }

// Session Timeouts
/** 30 minutes, in milliseconds. */
const SESSION_TIMEOUT = 30 * 60 * 1000;
app.use(session({
    secret: cipherKey,
    cookie: {
        maxAge: SESSION_TIMEOUT
    },
    store: new MemoryStore({
        checkPeriod: SESSION_TIMEOUT / 2,
        ttl: SESSION_TIMEOUT,
        dispose(sid) {
            ConnectionStore.deleteConnection(sid); // // ELM Connections are stored outside the session, so need to be deleted separately.
        },
    }),
    resave: true,
    rolling: true, // Each request will restart the session timer.
    saveUninitialized: false // Don't keep track of visitors that haven't logged in.
}));

// Every 24 hours sessions are deleted
cron.schedule("0 0 * * *", () => {
    // ConnectionStore.deleteConnections();
    console.log("ACTION EVERY 24 HRS");
});

/*
app.use(auth({
    secret: cipherKey,
    authRequired: false,
    routes: {
        callback: "/api/oidc/callback",
        login: "/api/oidc/login",
        logout: "/api/oidc/logout"
    },
    authorizationParams: {
        scope: "openid profile email",
        response_mode: "form_post",
        response_type: "code"
    }
}));
*/

// Keep this here or the jobs don't work.
import v1Router from "./routes/v1";

app.use("/api/v1", v1Router);
app.use(/\/api\/.*/, (req, res) => {
    res.status(404).json({ status: "error", message: `Could not find route '${req.originalUrl}'` });
});

import { requiresAuth } from "@backend/middleware/auth";
import { swaggerDocumentFromJSDoc, swaggerUIOptions } from "./swagger";
import swaggerUi from "swagger-ui-express";
app.use(
    "/api-docs",
    requiresAuth,
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocumentFromJSDoc, swaggerUIOptions)
);

/*
By registering this error handler middleware, Express
will invoke this middleware whenever an error occurs
during the request-response cycle.

Every router endpoint needs to add a try catch block
and send the error thru next(error) function call to
propagate the error to this global error handler middleware

Read more at: https://mirzaleka.medium.com/build-a-global-exception-handler-using-express-js-typescript-b9bb2f521e5e
*/
app.use(errorHandler);

// Webapp
app.use(express.static(webappPath));
app.use((_, res) => {
    res.sendFile(path.join(webappPath, "index.html"));
});

export default app;
