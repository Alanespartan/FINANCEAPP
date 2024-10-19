import { LogItem } from "./logger";
import { Task, TaskResponse } from "./task"

export type JobResult = "success" | "error" | "abandoned" | "info";
export type JobStatus = "not-started" | "in-progress" | JobResult;

export type JobUpdate = JobStatusUpdate | JobTaskCreatedUpdate;
export interface JobStatusUpdate {
    timestamp: number;
    type: "status";
    status: JobStatus;
}
export interface JobTaskCreatedUpdate {
    start: number;
    type: "task";
    title: string;
    status: JobStatus;
    log: LogItem[];
    progress: number;
    progressMax?: number;
    progressLabel?: string;
}

export type JobType = "My Tool";

export interface JobSummaryResponse {
    status: string;
    jobs: {
        id: string;
        status: string;
        start: number;
        jobType: string;
    }[]
}
export interface JobSummary {
    id: string;
    status: string;
    start: Date;
    jobType: string;
}

export interface APIJob {
    title: string;
    id: string;
    createdBy: string;
    jobType: string;
    status: string;
    start: Date;
    end?: Date;
    tasks: Task[];
    attachments?: Record<string, any>
}

export interface APIJobResponse {
    title: string;
    id: string;
    createdBy: string;
    jobType: string;
    status: string;
    start: number;
    end?: number;
    tasks: TaskResponse[];
    attachments?: string;
}
