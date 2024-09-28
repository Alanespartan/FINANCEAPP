import https from "https";
import fs from "fs";

import app from "./app";
import { Logger } from "@common/types/logger";

// Config
const port = 3000;

export const version = "1.0"; // Must match backend/package.json

// Logger
const logger = new Logger("server.ts");

if(process.env.CERT && process.env.KEY) {
    logger.verbose("Loading SSL credentials...");
    const credentials = {
        key:  fs.readFileSync(process.env.KEY,  "utf8"),
        cert: fs.readFileSync(process.env.CERT, "utf8")
    };
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(port, () => {
        console.log(`Express App ${version} server is running on 0.0.0.0:${port}.`);
    });
} else {
    if(process.env.NODE_ENV === "production") {
        logger.warn("Running in production without HTTPS (locally).");
        logger.warn("Consider using an SSL certificate by setting KEY and CERT.");
    }
    app.listen(port, () => {
        console.log(`Express App ${version} server is running on 0.0.0.0:${port}.`);
    });
}
