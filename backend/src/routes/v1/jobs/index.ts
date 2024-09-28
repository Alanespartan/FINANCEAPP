import { Router } from "express";
import { Logger } from "@common/types/logger";
import { jobController } from "@backend/routes/utils/job";

const jobRouter = Router();
const logger = new Logger("jobs.ts");

/**
 * @api {get} /api/v1/jobs Get a list of active jobs.
 * @apiName GetActiveJobs
 * @apiGroup Jobs
 * @apiSuccess (Success) {Object[]} jobs
 * @apiSuccess (Success) {String} jobs.status Status of the response.
 * @apiSuccess (Success) {Object[]} jobs.jobs
 * @apiSuccess (Success) {String} jobs.jobs.title Name of the job.
 * @apiSuccess (Success) {String} jobs.jobs.id Job's ID.
 * @apiSuccess (Success) {String} jobs.jobs.status Status of the job.
 * @apiSuccess (Success) {Number} jobs.jobs.start Start timestamp of the job.
 * @apiSuccess (Success) {Number} jobs.jobs.end End timestamp of the job.
 */
jobRouter.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        jobs: jobController.getJobs(req.session.id ?? "").map((j) => j.getSummary())
    });
});

/**
 * @api {get} /api/v1/jobs/:id Get the status of a job.
 * @apiName GetJobStatus
 * @apiGroup Jobs
 * @apiParam {String} id ID of the job.
 * @apiError (User Errors) NotFound The requested job could not be found.
 * @apiSuccess (Success) {Object[]} job
 * @apiSuccess (Success) {Object[]} job
 * @apiSuccess (Success) {String} job.title Name of the job.
 * @apiSuccess (Success) {String} job.id Job's ID.
 * @apiSuccess (Success) {String} job.status Status of the job.
 * @apiSuccess (Success) {Number} job.start Start timestamp of the job.
 * @apiSuccess (Success) {Number} job.end End timestamp of the job.
 * @apiSuccess (Success) {Object[]} job.tasks
 * @apiSuccess (Success) {String} job.tasks.title Name of the task.
 * @apiSuccess (Success) {Number} job.tasks.start Start timestamp of the task.
 * @apiSuccess (Success) {Number} job.tasks.end End timestamp of the task.
 * @apiSuccess (Success) {String} job.tasks.status Status of the task.
 * @apiSuccess (Success) {Object[]} job.tasks.log
 * @apiSuccess (Success) {String} job.tasks.log.type Value: `message`
 * @apiSuccess (Success) {Number} job.tasks.log.timestamp Message's timestamp.
 * @apiSuccess (Success) {String} job.tasks.log.message Message content.
 * @apiSuccess (Success) {String} job.tasks.log.level Message severity (debug, info, error, etc.)
 * @apiSuccess (Success) {Number} job.tasks.progress Tasks's progress.
 * @apiSuccess (Success) {String} job.tasks.progressMax Number that represents 100% of the task's progress.
 * @apiSuccess (Success) {String} job.tasks.progressLabel Text to label the progress with.
 */
jobRouter.get("/:id", (req, res) => {
    const id  = req.params.id;
    const job = jobController.getJob(id);
    if(!job) return res.status(404).json({ status: "error", message: `Could not find job ${id}` });
    res.status(200).json(job.toJSON());
});

/**
 * @api {get} /api/v1/jobs/:id/ws Get the web socket for a job on http server.
 * @apiName GetJobWebsocket
 * @apiGroup Jobs
 * @apiParam {String} id ID of the job.
 * @apiError (User Errors) NotFound The requested job could not be found.
 * @apiSuccess (Success) {n/a} null Opens a web socket.
 */
jobRouter.ws("/:id/ws", (ws, req) => {
    const id  = req.params.id;
    const job = jobController.getJob(id);
    logger.info(`web socket requested for job #${id}`);

    if(!job) return ws.close(404, JSON.stringify({ status: "error", message: `Could not find job: ${id}. Closing web socket...` }));

    ws.on("close", () => job.removeWebSocket(ws));
    job.addWebSocket(ws);
});

/**
 * @api {get} /api/v1/jobs/:id/ws Get the web socket for a job on https server.
 * @apiName GetJobWebsocket
 * @apiGroup Jobs
 * @apiParam {String} id ID of the job.
 * @apiError (User Errors) NotFound The requested job could not be found.
 * @apiSuccess (Success) {n/a} null Opens a web socket.
 */
jobRouter.ws("/:id/wss", (ws, req) => {
    const id  = req.params.id;
    const job = jobController.getJob(id);
    logger.info(`secure web socket requested for job #${id}`);

    if(!job) return ws.close(404, JSON.stringify({ status: "error", message: `Could not find job: ${id}. Closing web socket...` }));

    ws.on("close", () => job.removeWebSocket(ws));
    job.addWebSocket(ws);
});

export default jobRouter;
