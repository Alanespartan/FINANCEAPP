import { JobStatus } from "./job";
import { LogItemResponse } from "./logger";
// backend
export type TaskUpdate = TaskMessageUpdate | TaskProgressUpdate | TaskStatusUpdate;

export interface TaskStatusUpdate {
    task: string;
    timestamp: number;
    type: "status";
    status: JobStatus;
}
export interface TaskMessageUpdate {
    task: string;
    timestamp: number;
    type: "message";
    message: string;
}
export interface TaskProgressUpdate {
    task: string;
    timestamp: number;
    type: "progress";
    value: number;
    max?: number;
    label?: string;
}
// from frontend
export interface TaskLogItem {
    type: string;
    timestamp: Date;
    message: string;
    level: string;
}

export interface Task {
    title: string;
    start: Date;
    end?: Date;
    status: string;
    log: TaskLogItem[],
    progress: number;
    progressMax?: number;
    progressLabel?: string;
}

export interface TaskResponse {
    title: string;
    start: number;
    end?: number;
    status: string;
    log: LogItemResponse[],
    progress: number;
    progressMax?: number;
    progressLabel?: string;
}
