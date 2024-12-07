import { TExpenseType } from "./types";

/**
* @swagger
* components:
*   schemas:
*       CreateExpenseCategoryPayload:
*           type: object
*           properties:
*               name:
*                   type: string
*                   example: Gaming
*               isDefault:
*                   type: boolean
*                   example: true
*           required:
*               - name
*               - isDefault
*/
/** Interface that defines all the attributes within the payload for creating a new user expense category. */
export interface CreateExpenseCategoryPayload {
    /** e.g. Cards - Loans - Insurances - Online Suscriptions - Transport - Gaming */
    name: string;
    /** If the category was created when user was created as well */
    isDefault: boolean;
}

/**
* @swagger
* components:
*   schemas:
*       CreateExpenseSubCategoryPayload:
*           type: object
*           properties:
*               categoryId:
*                   type: number
*                   example: 1
*                   description: DB Expense Category Primary Key
*               name:
*                   type: string
*                   example: Gaming
*               type:
*                   $ref: "#/components/schemas/TExpenseType"
*               instrumentId:
*                   type: number
*                   format: integer
*                   example: 1
*                   description: Can be DB cardId, loanId or undefined if type is Real Expense (not a card, loan)
*           required:
*               - categoryId
*               - name
*               - type
*/
/** Interface that defines all the attributes within the payload for creating a new user expense sub category. */
export interface CreateExpenseSubCategoryPayload {
    /** DB Expense Category Primary Key */
    categoryId: number;
    /** e.g. Netflix - Holidays - Board Games - Uber Eats - Health Insurance */
    name: string;
    /** Depending on the type we refer to a Real Expense (1), Card (2) or Loan (3) */
    type: TExpenseType;
    /** Can be DB cardId, loanId or undefined if type is Real Expense */
    instrumentId?: number;
}

/**
* @swagger
* components:
*   schemas:
*       UpdateExpenseCategoryPayload:
*           type: object
*           properties:
*               name:
*                   type: string
*                   example: Cards - Loans - Insurances - Online Suscriptions - Transport - Gaming
*/
/** Representes the expected and possible parameters during a PUT request to update a user expense category. */
export interface UpdateExpenseCategoryPayload {
    /** If user set a new name to the expense category */
    name?: string;
}

/**
* @swagger
* components:
*   schemas:
*       UpdateExpenseSubCategoryPayload:
*           type: object
*           properties:
*               name:
*                   type: string
*                   example: Netflix - Holidays - Board Games - Uber Eats - Health Insurance
*/
/** Representes the expected and possible parameters during a PUT request to update a user expense sub category. */
export interface UpdateExpenseSubCategoryPayload {
    /** If user set a new name to the expense sub category */
    name?: string;
}
