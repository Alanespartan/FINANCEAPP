import path from "path";

import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import express from "express";
import session from "express-session";
// import expressWs from "express-ws";
import fileUpload from "express-fileupload";
import memoryStoreMaker from "memorystore";
import "tsconfig-paths/register"; // This loads path aliases from tsconfig.json

import { errorHandler } from "./middleware/errorHandler";
import { ConnectionStore } from "./session/connectionStore";

import { Session, SessionDebugLevel } from "./lib/axios/Session";
import * as cron from "node-cron";

if(process.env.NODE_ENV !== "production") {
    dotenv.config({
        path: path.resolve(__dirname, "..", "..", ".env")
    });
}

/* CHECK ENV VARIABLES */
if(!process.env.NODE_ENV)   { throw new Error("Must provide a NODE_ENV environment variable") }
if(!process.env.CIPHER_KEY) { throw new Error("Must provide a CIPHER_KEY environment variable") }
if(!process.env.LOG_LEVEL)  { throw new Error("Must provide a LOG_LEVEL environment variable") }
export const cipherKey = process.env.CIPHER_KEY;
export const environment = process.env.NODE_ENV;
export const desiredLogs = process.env.LOG_LEVEL;
if(desiredLogs === "info")       { Session.LEVEL = SessionDebugLevel.INFO }
else if(desiredLogs === "debug") { Session.LEVEL = SessionDebugLevel.DEBUG }
else if(desiredLogs === "trace") { Session.LEVEL = SessionDebugLevel.TRACE }

const MemoryStore = memoryStoreMaker(session);
const app = express();
const webabbPath = path.resolve(__dirname, "..", "..", "frontend", "dist");

// expressWs(app);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cookieParser());
app.use(fileUpload());

// Session Configuration
/** 30 minutes in milliseconds */
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
            ConnectionStore.deleteConnection(sid);
        }
    }),
    resave: true,
    rolling: true, // Each request will restart the session timer
    saveUninitialized: false // Don't keep track of visitors that haven't logged in
}))

// Load routes
import v1Router from "./routes/v1";
app.use("/api/v1", v1Router.getRouter());
app.use(/\/api\/.*/, (req, res) => {
    res.status(404).json({ status: "error", message: `Could not find route '${req.originalUrl}'` })
})

// Error handling
app.use(errorHandler);

// Load Web App Front end
app.use(express.static(webabbPath));
app.use((_, res) => {
    res.sendFile(path.join(webabbPath, "index.html"));
});

export default app;