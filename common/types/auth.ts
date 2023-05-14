export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserSession {
    email: string;
    firstName: string;
    lastName: string;
}