import https from "https";
import fs from "fs";

import app from "./app";
import { Logger } from "@common/util/logger";

const port = 3000;

export const version = "1.0.0";

const logger = new Logger("src/server.ts");

if(process.env.CERT && process.env.KEY) {
    logger.verbose("Loading SSL credentials...");
    const credentials = {
        cert: fs.readFileSync(process.env.CERT),
        key: fs.readFileSync(process.env.KEY, "utf-8")
    };
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(port, () => {
        console.log(`Finance App ${version} server is running on 0.0.0.0:${port}`);
    });
} else {
    if(process.env.NODE_ENV === "production") {
        logger.warn("Running in production without HTTPS (locally).");
        logger.warn("Consider using a SSL certificate by setting up KEY and CERT env variables.");
    }
    console.log(`Finance App ${version} server is running on 0.0.0.0:${port}`);
}