/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomUUID } from "crypto";
import { WebSocket } from "ws";
import { Logger, LogLevel, LogItem } from "@common/types/logger";
import { JobType, JobStatus, JobUpdate, JobResult} from "@common/types/job";
import { TaskUpdate } from "@common/types/task";

export class JobController
{
    private jobs = new Map<string, Job>();

    /**
     * Creates a job.
     * @param  {string} title Job title
     * @returns Job object.
     */
    public createJob(title: string, createdBy: string, jobType: JobType, server: string) {
        const uuid = randomUUID();
        const job = new Job(title, uuid, createdBy, jobType, server);
        this.jobs.set(uuid, job);
        return job;
    }

    /**
     * Check if a job exists.
     * @param  {string} id ID of job to search for.
     * @returns Whether or not the job exists.
     */
    public hasJob(id: string) { return this.jobs.has(id); }

    /**
     * Gets a job.
     * @param  {string} id ID of job to get.
     */
    public getJob(id: string) {
        return this.jobs.get(id);
    }

    /**
     * Get multiple jobs from specific server.
     * @param  {Session} server server from where to get jobs.
     * @returns List of active jobs for a given server.
     */
    public getJobs(server: string) {
        return Array.from(this.jobs.values()).filter((job) => job.getServer() === server);
    }

    /**
     * Get multiple jobs.
     * @returns List of active jobs.
     */
    public getAllJobs() {
        return Array.from(this.jobs.values());
    }
}

export class Job // extends Logger
{
    private status: JobStatus = "not-started";
    private start: number;
    private end?: number;
    private websockets: WebSocket[] = [  ];
    private attachments?: Record<string, any>;

    private tasks: Task[] = [  ];
    private taskIndices: Record<string, number> = {  };

    public constructor(
        public title: string,
        public readonly id: string,
        public readonly createdBy: string,
        public readonly jobType: JobType,
        private server: string
    ) {
        this.start = Date.now();
    }

    public addAttachment(name: string, value: any) {
        if(!this.attachments) { this.attachments = { }; }
        this.attachments[name] = value;
    }

    public getServer() { return this.server; }
    public getStatus() { return this.status; }
    public getTasks()  { return this.tasks; }

    public getTask(index: number): Task;
    public getTask(title: string): Task;
    public getTask(indexOrTitle: number | string): Task {
        if(typeof(indexOrTitle) === "string") { return this.tasks[this.taskIndices[indexOrTitle]]; }
        else { return this.tasks[indexOrTitle]; }
    }

    public createSubTask(title: string, message?: string) {
        if(this.status === "not-started") {
            this.setStatus("in-progress");
        }

        const task = new Task(this, title, message);
        this.tasks.push(task);
        this.taskIndices[title] = this.tasks.length - 1;
        this.update({
            type: "task",
            ...task.toJSON()
        });
        return task;
    }

    public update(data: TaskUpdate | JobUpdate) {
        for(const ws of this.websockets) {
            ws.send(JSON.stringify(data));
        }
    }

    public setTitle(newTitle: string){
        this.title = newTitle;
    }
    public setStatus(status: JobStatus) {
        this.status = status;
        this.update({
            type: "status",
            timestamp: Date.now(),
            status
        });
    }
    public finishJob(result: JobResult) {
        this.status = result;
        this.end = Date.now();
        this.update({
            timestamp: this.end,
            type: "status",
            status: this.status
        });

        for(const ws of this.websockets) {
            ws.close();
        }
        this.websockets = [  ];
    }

    public addWebSocket(ws: WebSocket) {
        ws.send(JSON.stringify({ type: "job", ...this.toJSON() }));
        this.websockets.push(ws);
    }
    public removeWebSocket(ws: WebSocket) {
        const index = this.websockets.indexOf(ws);
        if(index < 0) { return; }
        this.websockets.splice(index, 1);
    }

    public getSummary() {
        return {
            title: this.title,
            id: this.id,
            createdBy: this.createdBy,
            jobType: this.jobType,
            status: this.status,
            start: this.start,
            end: this.end
        };
    }
    public toJSON() {
        return {
            title: this.title,
            id: this.id,
            createdBy: this.createdBy,
            jobType: this.jobType,
            status: this.status,
            start: this.start,
            end: this.end,
            tasks: this.tasks.map((t) => t.toJSON()),
            attachments: JSON.stringify(this.attachments)
        };
    }
}

export class Task extends Logger
{
    public readonly start: number;
    public end?: number;

    private status: JobStatus = "in-progress";
    private logRecord: LogItem[] = [  ];

    /** Progress of the task, from 0 to 100 (inclusive). */
    private progress = 0;
    private progressMax?: number;
    private progressLabel = "";

    public constructor(
        private readonly parent: Job,
        public readonly title: string,
        message?: string
    ) {
        super();
        this.start = Date.now();
        if(message) { this.info(message); }
    }

    public getStatus() { return this.status; }
    public getLog() { return this.log; }
    public formatProgressLabel() {
        return this.progressLabel ?
            this.progressLabel
                .replace(/%value%/g, this.progress.toString())
                .replace(/%max%/g, (this.progressMax || "-").toString()) :
            "";
    }

    protected write(message: string, level: LogLevel) {
        const msg = {
            type: "message",
            timestamp: Date.now(),
            message,
            level
        } as const;

        this.logRecord.push(msg);
        this.parent.update({ task: this.title, ...msg });
    }

    public setProgressMax(max: number) {
        this.progressMax = max;
        const data = {
            type: "progress",
            timestamp: Date.now(),
            value: this.progress,
            max,
            label: this.formatProgressLabel()
        } as const;
        this.parent.update({ task: this.title, ...data });
    }
    public setProgress(value: number, label?: string) {
        this.progress = value;
        if(label) { this.progressLabel = label; }
        const data = {
            type: "progress",
            timestamp: Date.now(),
            value,
            label: this.formatProgressLabel()
        } as const;

        this.parent.update({ task: this.title, ...data });
    }

    public incrementProgress(amount = 1) {
        this.setProgress(this.progress + amount);
    }

    public finishTask(result: JobResult) {
        this.status = result;
        this.info(`Done: ${result}.`);
        this.setProgress(this.progressMax ?? 100);
        this.end = Date.now();
    }

    public toJSON() {
        return {
            title: this.title,
            start: this.start,
            end: this.end,
            status: this.status,
            log: this.logRecord,
            progress: this.progress,
            progressMax: this.progressMax,
            progressLabel: this.formatProgressLabel()
        };
    }
}



export const jobController = new JobController();
