export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserSession {
    email: string;
    firstName: string;
    lastName: string;
    userId: string; // used to match with user data from db
}