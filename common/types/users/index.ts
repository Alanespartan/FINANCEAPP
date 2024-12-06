import { ILoan } from "types/loans";
import { ICard } from "../cards";
import { IExpenseCategory, IExpenseSubCategory } from "types/expenses";

/**
* @swagger
* components:
*   schemas:
*       IUser:
*           type: object
*           properties:
*               id:
*                   type: number
*                   example: 1
*               email:
*                   type: string
*                   example: test@gmail.com
*               password:
*                   type: string
*                   example: userpassword
*               firstName:
*                   type: string
*                   example: John
*               lastName:
*                   type: string
*                   example: Doe
*               cash:
*                   type: number
*                   format: double
*                   example: 730.50
*               cards:
*                   type: array
*                   items:
*                       $ref: "#/components/schemas/ICard"
*               loans:
*                   type: array
*                   items:
*                       $ref: "#/components/schemas/ILoan"
*               expenseCategories:
*                   type: array
*                   items:
*                       $ref: "#/components/schemas/IExpenseCategory"
*               expenseSubCategories:
*                   type: array
*                   items:
*                       $ref: "#/components/schemas/IExpenseSubCategory"
*           required:
*               - id
*               - email
*               - firstName
*               - lastName
*               - cash
*               - cards
*               - loans
*               - expenseCategories
*               - expenseSubCategories
*/
/** Interface used to have a representation of all attributes within the User Class */
export interface IUser {
    /** DB Primary Key */
    id: number;
    /** DB Unique ID */
    email: string;
    /** Optional, is needed in the backend but it is not in the frontend */
    password?: string;
    firstName: string;
    lastName: string;
    /** Amount of cash the user has available */
    cash: number;
    /** All cards the user has registered */
    cards: ICard[];
    /** All loans the user has registered */
    loans: ILoan[];
    /** All expense categories the user has registered */
    expenseCategories: IExpenseCategory[];
    /** All expense sub categories the user has registered */
    expenseSubCategories: IExpenseSubCategory[];
}

/**
* @swagger
* components:
*   schemas:
*       ISimpleUser:
*           type: object
*           properties:
*               id:
*                   type: number
*                   example: 1
*               email:
*                   type: string
*                   example: test@gmail.com
*               firstName:
*                   type: string
*                   example: John
*               lastName:
*                   type: string
*                   example: Doe
*           required:
*               - id
*               - email
*               - firstName
*               - lastName
*/
/** Interface used to have a simple representation of a User and its essential attributes. */
export interface ISimpleUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}
