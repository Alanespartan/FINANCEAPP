import { IBank } from "../util";

/* BBVA PRESTAMO X, RAPPI PRESTAMO Y */
export interface LoanOptions {
    holderName: string;
    expires: Date;
    issuer: IBank;
    borrowed: number;
    alias: string;
    limit?: number;
}
