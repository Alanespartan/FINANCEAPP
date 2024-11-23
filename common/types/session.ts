import { ISimpleUser } from "./users";

export interface OIDCSession {
    country: string;
    firstname: string;
    phonenumber: string;
}

export interface SimpleSession {
    sso: string;
    server: string;
    userCache?: ISimpleUser[];
}
