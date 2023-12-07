import { Bank } from "../util";

export enum CardTypes {
    DEBIT   = 1,
    CREDIT  = 2,
    VOUCHER = 3
}

export interface CardOptions {
    cardNumber: string;
    holderName: string;
    expires: Date;
    issuer: Bank;
    balance: number;
    alias: string;
    limit?: number;
}