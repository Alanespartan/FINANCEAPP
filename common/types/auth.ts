export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserSession {
    id: string; // used to match with user data from db
    email: string;
    firstName: string;
    lastName: string;
}