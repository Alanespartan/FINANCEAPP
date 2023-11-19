/* What did I pay for 
las mismas tarjetas son una categoría (con NU puedo pagar BBVA)
los prestamos son una categoria (con BBVA pago prestamo RAPPI)
las suscripciones son una categoria
*/
export interface ExpenseCategory {
    id: string;
    name: string; // Gas - Trips - Gifts - Delivery - Gaming - etc
}

/* Something that I paid for */
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

export enum PaymentMethod {
    CASH = 1,
    CARD = 2
}

export interface PaymentConfig {
    total: number;
    category: ExpenseCategory;
    method: PaymentMethod,
    cardOptions?: { // in case method is a card
        cardAlias: string; // e.g. Tarjeta de Débito NU 4421 1598 3034 1304
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