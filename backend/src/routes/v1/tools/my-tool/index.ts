import { Logger } from "@common/types/logger";
import {
    validateRequestBody,
    getHeaders
} from "@backend/utils/requests";
import { jobController} from "@backend/routes/utils/job";
import { rxUsageFunction}  from "./functions";
import { Router } from "express";

const router = Router();
const logger = new Logger("index.ts");

/** Fix artifacts from a given module configuration */
router.post("/fix-dng-links-module", async (req, res) => {
    const { header1: newHeader1, header2 } = getHeaders(req,
        [ "header1", "Expected 'header1' header." ],
        [ "header2", "Expected 'header2' header." ],
    );
    console.log(header2, newHeader1);
    const expected: { propName: string, type: string }[] = [
        { propName: "prop1", type: "string" },
        { propName: "prop2", type: "undefined" }, // unknown[]
        { propName: "prop3", type: "undefined" }  // unknown[]
    ];
    if(validateRequestBody(req.body, expected)) {
        const prop1 = req.body.prop1;
        const prop2 = JSON.parse(req.body.prop2) as unknown[];
        const prop3 = JSON.parse(req.body.prop3) as unknown[];
        console.log(prop1, prop2, prop3);

        const job = jobController.createJob("Job Creation Title.", req.userData.firstName, "My Tool", "server here");

        res.status(200).json({ status: "ok", job: job.id });

        const summaryTask = job.createSubTask("Summary");
        rxUsageFunction(job, summaryTask)
            .catch((err) => {
                logger.info(`JOB STARTS: ${job.id}`);
                job.finishJob("error");
                console.log(err);
            }).finally(() => {
                logger.info(`JOB ENDS: ${job.id}`);
            });
    }
});

export { router };
