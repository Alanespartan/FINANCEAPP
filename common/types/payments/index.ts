/* What did I pay for 
las mismas tarjetas son una categoría (con NU puedo pagar BBVA)
los prestamos son una categoria (con BBVA pago prestamo RAPPI)
las suscripciones son una categoria
*/
export interface ExpenseCategory {
    id: string;
    name: string; // Gas - Trips - Gifts - Delivery - Gaming - Tarjeta de Débito NU 4444 1515 3030 1313
}

/* Something that I paid for */
export interface Expense {
    id: string;
    total: number;
    category: ExpenseCategory;
    method: {
        type: TPaymentMethod,
        name: string // card alias, simple "cash", savings account name, etc.
    },
    paymentDate: Date;
    comment?: string;
}

export type TPaymentMethod       = "CASH" | "CARD";
export type TFinancialInstrument = "SAVINGS" | "INVESTMENTS" | "LOAN";
export type TFinancialRepository = TPaymentMethod | TFinancialInstrument;

export interface PaymentConfig {
    total: number;
    category: ExpenseCategory;
    method: TPaymentMethod,
    cardOptions?: { // in case method is a card
        cardAlias: string; // e.g. Tarjeta de Débito NU 4444 1515 3030 1313
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