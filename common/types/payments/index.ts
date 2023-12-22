/** What type of object the user is paying for.
 * Credit/Debit cards are a category
 * Loans are a category
 * Suscriptions are a category
 * */
export interface ExpenseCategory {
    id: string;
    alias: string; // e.g. Gas - Trips - Gifts - Delivery - Gaming - NU CARD 4444 1515 3030 1313
    description?: string;
    isDefault: boolean;
}

/** Used to store the information of a payment. */
export interface Expense {
    id: string;
    total: number;
    category: ExpenseCategory;
    method: {
        type: PaymentMethod,
        name: string // card alias, simple "cash", savings account name, etc.
    },
    paymentDate: Date;
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

/** Used to define a payment done by the user and send it to the server. */
export interface PaymentConfig {
    total: number;
    category: ExpenseCategory;
    method: PaymentMethod,
    cardOptions?: { // in case method is a card
        cardAlias: string; // e.g. NU CARD 4444 1515 3030 1313
        isCredit: boolean;
    }
    comment?: string;
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