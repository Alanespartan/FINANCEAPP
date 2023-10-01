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
    name: string; // TDC NU - TDD BBVA - CASH - Mercado Pago - Otro
    isCard: boolean;
    isCash: boolean;
}

export interface PaymentOptions {
    amount: number;
    type: ExpenseType;
    paymentDate: Date;
    method: PaymentType; // todo define this
    comment?: string;
}

/* 
Con PaymentOptions condenso la información de mi compra.
Con PaymentType digo con que pagué.
Con ExpenseType digo qué estoy comprando.
Con Expense genero el registro de en que gasté.
*/