import { SimpleCardOptions } from "types/cards";

/** What type of object the user is paying for.
 * Credit/Debit cards are a category
 * Loans are a category
 * Suscriptions are a category
 * */
export interface ExpenseCategory {
    id: string;
    alias: string; // e.g. Gas - Trips - Gifts - Delivery - Gaming - NU CARD 4444 1515 3030 1313
    description?: string;
    /** If user creates a new expense category is false, otherwise it was created automatically during user account creation.  */
    isDefault: boolean;
    /** If the expense category is a card */
    isCard: boolean;
}

/** Used to define a payment done by the user and send it to the server. */
export interface PaymentConfig {
    /** How much is the user paying. */
    total: number;
    /** What the user is paying for. */
    category: ExpenseCategory;
    /** If it was paid with a cash or card. */
    method: PaymentMethod;
    /** In case payment was done with a card, we have this attribute to get the card basic details. */
    cardOptions?: SimpleCardOptions;
    /** User can add a description/comment to describe what he is paying for. */
    comment?: string;
}

/** Used to store the information of a payment. */
export interface Expense {
    id: string;
    /** How much money was paid. */
    total: number;
    /** What was paid for. */
    category: ExpenseCategory;
    /** If it was paid with cash or card.  */
    method: PaymentMethod;
    /** When they payment was done. */
    paymentDate: Date;
    /** If the user added a description/comment to describe what he was paying for. */
    comment?: string;
}

/** Used to define what type of method is used to pay. */
export enum PaymentMethod {
    CASH = "CASH",
    CARD = "CARD"
}

/** Used to define what type of financial object the user opens. */
export enum FinancialInstrument {
    SAVINGS     = "SAVINGS",
    INVESTMENTS = "INVESTMENTS",
    LOAN        = "LOAN"
}

/** Handles both payment methods and financial instruments. */
export const FinancialRepository = {
    ...PaymentMethod,
    ...FinancialInstrument
}

/*
Con PaymentOptions condenso la información de mi compra.
Con PaymentType digo con que pagué.
Con ExpenseType digo qué estoy comprando.
Con Expense genero el registro de en que gasté.
*/

/* NOMINA, TRANSFERNCIA EXTERNA, RENDMIENTOS, VENTA DE PRODUCTO*/
export interface Income {

}
