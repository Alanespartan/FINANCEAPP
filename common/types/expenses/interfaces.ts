import { TExpenseType } from "./types";

/** Main categories that are created when the user constructor is called. */
export const DefaultCategories = [
    "Cards",
    "Loans",
    "Leisure",
    "Sports",
    "Food",
    "Health",
    "Beauty",
    "Transport",
    "Government",
    "Online Subscriptions",
    "Online Shopping",
    "Other"
];

/**
* @swagger
* components:
*   schemas:
*       IExpenseCategory:
*           type: object
*           description: This interface is similar to a "Tag", since it helps for grouping expenses by category.
*           properties:
*               id:
*                   type: number
*                   example: 1
*                   description: DB Primary Key
*               name:
*                   type: string
*                   example: Gaming
*               isDefault:
*                   type: boolean
*                   example: true
*               userId:
*                   type: number
*                   format: integer
*                   example: 1
*                   description: DB Foreign Key - User ID
*               subcategories:
*                   type: array
*                   items:
*                       $ref: "#/components/schemas/IExpenseSubCategory"
*           required:
*               - id
*               - name
*               - isDefault
*               - userId
*               - subcategories
*/

/** This interface is similar to a "Tag", since it helps for grouping expenses by category.
* * Each Card is within Cards category
* * Each Loan is within Loans category
* * A user can create as many categories as he wants.
* */
export interface IExpenseCategory {
    /** DB Primary Key */
    id: number;
    /** e.g. Cards - Loans - Insurances - Online Suscriptions - Transport - Gaming */
    name: string;
    /** If the category was created when user was created as well */
    isDefault: boolean;
    /** DB Foreign Key - User ID */
    userId: number;
    /** Attached sub categories */
    subcategories: IExpenseSubCategory[];
}

/**
* @swagger
* components:
*   schemas:
*       IExpenseSubCategory:
*           type: object
*           description: This interface is similar to a "Tag", since it helps for grouping expenses by category.
*           properties:
*               id:
*                   type: number
*                   example: 1
*                   description: DB Primary Key
*               name:
*                   type: string
*                   example: Netflix
*               type:
*                   $ref: "#/components/schemas/TExpenseType"
*               userId:
*                   type: number
*                   format: integer
*                   example: 1
*                   description: DB Foreign Key - User ID
*               categories:
*                   type: array
*                   items:
*                       $ref: "#/components/schemas/IExpenseCategory"
*               instrumentId:
*                   type: number
*                   format: integer
*                   example: 1
*                   description: Can be DB cardId, loanId or undefined if type is Real Expense (not a card, loan)
*           required:
*               - id
*               - name
*               - type
*               - userId
*               - categories
*/
/** This interface is similar to a "Tag", since it helps for grouping expenses by sub category. A sub category can appear in multiple categories.
*
* Example:
* * Online Suscriptions Category has 3 Sub Categories: HBO+, Netflix, and Disney+
* * Gaming Category has 2 Sub Categories: Play Station +, and XBOX Game Pass
* */
export interface IExpenseSubCategory {
    /** DB Primary Key */
    id: number;
    /** e.g. Netflix - Holidays - Board Games - Uber Eats - Health Insurance */
    name: string;
    /** Depending on the type we refer to a Real Expense (1), Card (2) or Loan (3) */
    type: TExpenseType;
    /** DB Foreign Key - User ID */
    userId: number;
    /** Categories where the sub category appears */
    categories: IExpenseCategory[];
    /** Can be DB cardId, loanId or undefined if type is Real Expense (not a card, loan) */
    instrumentId?: number;
}

/** Interface used to have a representation of all attributes within the Expense Class */
export interface IExpense {
    /** DB Primary Key */
    id: string;
    /** When they payment was done. */
    paymentDate: Date;
    /** How much money was paid. */
    total: number;
    /** DB Foreign Key - Expense Sub Category ID */
    subCategoryId: number;
    /** If the user added a description/comment to describe what he was paying for. */
    description?: string;
}

