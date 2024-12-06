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

/** Interface that defines all the attributes within the payload for creating a new user expense sub category. */
export interface CreateExpenseSubCategoryPayload {
    /** e.g. Cards - Loans - Insurances - Online Suscriptions - Transport - Gaming */
    name: string;
    /** Depending on the type we refer to a Real Expense (1), Card (2) or Loan (3) */
    type: TExpenseType;
    /** Can be DB cardId, loanId, savingId or undefined if type is Real Expense */
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
/** Representes the expected and possible parameters during a PUT request to update a user expense type. */
export interface UpdateExpenseCategoryPayload {
    /** If user set a new name to the card. */
    name?: string;
}

export interface UpdateExpenseSubCategoryPayload {
    /** If user set a new name to the card. */
    name?: string;
}
