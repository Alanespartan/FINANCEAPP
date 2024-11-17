import { Bank } from "../util";

export enum CardTypes {
    ALL      = 0,
    DEBIT    = 1,
    CREDIT   = 2,
    VOUCHER  = 3, // SiVale
    SERVICES = 5 // e.g AMEX PLATINUM
}

export interface CardOptions {
    cardNumber: string;
    holderName: string;
    expires: Date;
    issuer: Bank;
    balance: number;
    alias?: string;
    limit?: number;
}

/** User deactivates digital card and issues a new one.
 * The bank, limit, current balance and names remain the same as before.
 * There is a new date, a new card number and a possible new alias. */
export interface UpdateCardOptions {
    cardNumber: string;
    expires: Date;
    alias?: string;
}
