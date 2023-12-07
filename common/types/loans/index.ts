import { Bank } from "../util";

/* BBVA PRESTAMO X, RAPPI PRESTAMO Y */
export interface LoanOptions {
    holderName: string;
    expires: Date;
    issuer: Bank;
    borrowed: number;
    alias: string;
    limit?: number;
}