export interface Alert {
    type: string;
    message: string;
    timeout?: number;
    dismissible?: boolean;
}

export interface Toast {
    type: string;
    message: string;
    timeout?: number;
    dismissible?: boolean;
}
