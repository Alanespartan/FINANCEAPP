/**
* @swagger
* components:
*   schemas:
*       TAvailableExpenseTypes:
*           type: integer
*           description: A multi-option type representing all the available Expense Types a user can create.
*           enum: [0, 1, 2, 3]
*           x-enum-varnames: [ALL, DEBIT, CREDIT, SERVICES]
*           properties:
*               0:
*                   description: If what you are paying is a real expense (e.g. Gas - Dates - Trip)
*               1:
*                   description: If what you are paying is a card.
*               2:
*                   description: If what you are paying is a loan.
*               3:
*                   description: If you're adding money to a savings account.
*/
/** Object Enum representing all the possible expense types a user can have. */
export const ETypesOfExpense = {
    /** If what you are paying is a real expense (e.g: Gas - Dates - Trip) */
    REALEXPENSE: 0,
    /** If what you are paying is a card */
    CARD:        1,
    /** If what you are paying is a loan */
    LOAN:        2,
    /** If you're adding money to a savings account */
    SAVINGS:     3
} as const;
/** Depending on the type we refer to a Real Expense (0), Card (1), Loan (2) or Saving Account (3) */
export type TAvailableExpenseTypes = typeof ETypesOfExpense[keyof typeof ETypesOfExpense];

/**
* @swagger
* components:
*   schemas:
*       IExpenseType:
*           type: object
*           description: What type of object the user is paying for. This feature can be similar to a "Tag", it also helps for grouping expenses by type.
*           properties:
*               id:
*                   type: number
*                   example: 1
*                   description: DB Primary Key
*               name:
*                   type: string
*                   example: Gaming
*               type:
*                   $ref: "#/components/schemas/TAvailableExpenseTypes"
*               archived:
*                   type: boolean
*                   example: false
*               userId:
*                   type: number
*                   format: integer
*                   example: 1
*                   description: DB Foreign Key - User ID
*               instrumentId:
*                   type: number
*                   format: integer
*                   example: 1
*                   description: Can be DB cardId, loanId, savingId or undefined if type is Real Expense
*           required:
*               - id
*               - name
*               - type
*               - archived
*               - userId
*/
/** Interface used to have a representation of all attributes within the Expense Type Class
*
* This interface can be similar to a "Tag", since it also helps for grouping expenses by type.
* * Each Card has a category
* * Each Loan has a category
* * Each Savings Account has a category
* * A user can create as many type as he wants.
* */
export interface IExpenseType {
    /** DB Primary Key */
    id: number;
    /** e.g. Gas - Trips - Gifts - Delivery - Gaming */
    name: string;
    /** Depending on the type we refer to a Real Expense (0), Card (1), Loan (2) or Saving Account (3) */
    type: TAvailableExpenseTypes;
    archived: boolean;
    /** DB Foreign Key - User ID */
    userId: number;

    /** Can be DB cardId, loanId, savingId or undefined if type is Real Expense */
    instrumentId?: number;
}

/** Interface used to have a representation of all attributes within the Expense Class */
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

/**
* @swagger
* components:
*   schemas:
*       CreateExpenseTypePayload:
*           type: object
*           properties:
*               name:
*                   type: string
*                   example: Gaming
*               type:
*                   $ref: "#/components/schemas/TAvailableExpenseTypes"
*               instrumentId:
*                   type: number
*                   format: integer
*                   example: 1
*                   description: Can be DB cardId, loanId, savingId or undefined if type is Real Expense
*           required:
*               - name
*               - type
*/
/** Interface that defines all the attributes the payload for creating a new user Expense Type needs. */
export interface CreateExpenseTypePayload {
    /** e.g. Gas - Trips - Gifts - Delivery - Gaming */
    name: string;
    /** Depending on the type we refer to a Real Expense (0), Card (1), Loan (2) or Saving Account (3) */
    type: TAvailableExpenseTypes;

    /** Can be DB cardId, loanId, savingId or undefined if type is Real Expense */
    instrumentId?: number;
}
