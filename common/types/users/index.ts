import { ICard } from "../cards";

/** Interface used to represent a User class */
export interface IUser {
    id: number; // used to match with user data from db
    email: string;
    firstName: string;
    lastName: string;
    cards: ICard[];
}

export interface ISimpleUser {
    sso: string,
    name: string
}
