/**
* @swagger
* components:
*   schemas:
*       TExpenseType:
*           type: integer
*           description: A multi-option type representing all the available Expense Types a user can create. Real Expense (1), Card (2), Loan (3) or Savings Account (4)
*           enum: [1, 2, 3, 4]
*           x-enum-varnames: [REALEXPENSE, CARD, LOAN, SAVINGS]
*           properties:
*               1:
*                   description: If what you are paying is a real expense (e.g. Gas - Dates - Trip)
*               2:
*                   description: If what you are paying is a card.
*               3:
*                   description: If what you are paying is a loan.
*               4:
*                   description: If you're adding money to a savings account.
*       TExpenseTypeFilter:
*           type: integer
*           description: A multi-option type representing all the available Expense Types a user can filter for.
*           enum: [0, 1, 2, 3, 4]
*           x-enum-varnames: [ALL, REALEXPENSE, CARD, LOAN, SAVINGS]
*           properties:
*               0:
*                   description: Represents all types of expense type.
*               1:
*                   description: If what you are paying is a real expense (e.g. Gas - Dates - Trip)
*               2:
*                   description: If what you are paying is a card.
*               3:
*                   description: If what you are paying is a loan.
*               4:
*                   description: If you're adding money to a savings account.
*/
/** Object Enum representing all the possible expense types the application can manipulate. */
export const OETypesOfExpense = {
    ALL:         0,
    /** If what you are paying is a real expense (e.g. Gas - Dates - Trip) */
    REALEXPENSE: 1,
    /** If what you are paying is a card */
    CARD:        2,
    /** If what you are paying is a loan */
    LOAN:        3,
    /** If you're adding money to a savings account */
    SAVINGS:     4
} as const;
/** A multi-option type representing all the available Expense Types a user can create. Real Expense (1), Card (2), Loan (3) or Savings Account (4) */
export type TExpenseType = typeof OETypesOfExpense.REALEXPENSE | typeof OETypesOfExpense.CARD | typeof OETypesOfExpense.LOAN | typeof OETypesOfExpense.SAVINGS;
/** A multi-option type representing all the available Expense Types a user can filter for. */
export type TExpenseTypeFilter = typeof OETypesOfExpense.ALL | TExpenseType;

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
*                   $ref: "#/components/schemas/TExpenseType"
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
    /** Depending on the type we refer to a Real Expense (1), Card (2), Loan (3) or Savings Account (4) */
    type: TExpenseType;
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
*                   $ref: "#/components/schemas/TExpenseType"
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
    /** Depending on the type we refer to a Real Expense (1), Card (2), Loan (3) or Savings Account (4) */
    type: TExpenseType;

    /** Can be DB cardId, loanId, savingId or undefined if type is Real Expense */
    instrumentId?: number;
}

/**
* @swagger
* components:
*   schemas:
*       UpdateExpenseTypePayload:
*           type: object
*           properties:
*               archived:
*                   type: boolean
*                   example: false
*               name:
*                   type: string
*                   description: The name of the card.
*                   example: Visa (Crédito|Débito) BBVA Digital
*/
/** Representes the expected and possible parameters during a PUT request to update a user expense type. */
export interface UpdateExpenseTypePayload {
    /** If user decides to delete a card, archived instead for data safety and governance. */
    archived?: boolean;
    /** If user set a new name to the card. */
    name?: string;
}
