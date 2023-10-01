export enum CardTypes {
    DEBIT   = 1,
    CREDIT  = 2,
    VOUCHER = 3
}

export interface Bank {
    name: string;
    // contact information
    country: string;
    phone: string;
}

export interface CardOptions {
    cardNumber: string;
    holderName: string;
    expires: Date;
    issuer: Bank;
    balance: number;
    limit?: number;
}

export interface MSIOptions {
    months: number;
}