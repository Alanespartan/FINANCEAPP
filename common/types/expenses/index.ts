/** What type of object the user is paying for. This feature can be similar to a "Tag", it also helps for grouping expenses by type.
* * Each Credit/Debit cards are a category
* * Each Loan has a category
* * Each Savings Account has a category
* * A user can create as many type as he wants.
* */
export interface IExpenseType {
    /** DB Primary Key */
    id: number;
    /** e.g. Gas - Trips - Gifts - Delivery - Gaming */
    name: string;
    /** Part 1/2 of DB Unique ID - Depending on the type we refer to a Card, Loan, Saving Account, Real Expense */
    type: number;
    /** Part 2/2 of DB Unique ID - Can be DB cardId, loanId, savingId or realExpenseId */
    instrumentId: number;
    archived: boolean;
    /** DB Foreign Key - User ID */
    userId: number;
}

/** Used to store the information of a payment. */
export interface IExpense {
    /** DB id */
    id: string;
    /** When they payment was done. */
    paymentDate: Date;
    /** How much money was paid. */
    total: number;
    /** If the user added a description/comment to describe what he was paying for. */
    description?: string;
    /** What was paid for. */
    expenseTypeId: number;
}

/*************************************/
/*********   HELPER SCHEMAS   ********/
/* e.g.                              */
/* - Request Payloads                */
/* - Basic Representation of Classes */
/*************************************/

/** Interface that defines all the attributes the payload for creating a new user card needs. */
export interface CreateExpenseTypePayload {
    issuerId: number;
    balance: number;
}
