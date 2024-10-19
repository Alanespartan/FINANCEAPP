export interface RequestError {
    code: number;
    resMessage: ResMessage;
    message: string;
}

export interface ResMessage {
    info: string;
    message: string;
}

export interface ErrorResponse {
    status: string;
    message: string;
    info?: string;
}
