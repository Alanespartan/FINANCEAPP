import { MSIOptions } from "types/cards";

/* What did I pay for */
export interface ExpenseType {
    id: string;
    name: string; // Gas - Trips - Gifts - Delivery - Gaming - etc
}

/* Something that I paid for */
export interface Expense {
    id: string;
    amount: number;
    type: ExpenseType;
    paymentDate: Date;
    comment?: string;
}

/* Used to pay an expense */
export interface PaymentType {
    id: string; // user can create as many payment types as he wants
    alias: string; // TDC NU - TDD BBVA - CASH - Mercado Pago - Otro
}

export interface PaymentOptions {
    amount: number;
    type: ExpenseType;
    paymentDate: Date;
    method: PaymentType; // todo define this
    isCard: boolean;
    isCash: boolean;
    cardOptions?: {
        cardNumber: string; // e.g. 4421 1598 3034 1304
        isCredit: boolean;
        msi?: MSIOptions
    }
    comment?: string;
}

/* 
Con PaymentOptions condenso la información de mi compra.
Con PaymentType digo con que pagué.
Con ExpenseType digo qué estoy comprando.
Con Expense genero el registro de en que gasté.
*/