import { IUser } from "../users";
import { IBank, TPayFrequency } from "../util";

/**
* @swagger
* components:
*   schemas:
*       ICard:
*           type: object
*           properties:
*               id:
*                   type: number
*                   format: integer
*                   description: DB Primary Key
*                   example: 1
*               name:
*                   type: string
*                   example: Crédito Nissan Versa BBVA
*               createdOn:
*                   type: number
*                   example: 1682497156317
*                   description: When the loan was created
*               expires:
*                   type: number
*                   example: 1732497156317
*                   description: Expiration date in timestamp utc format.
*               borrowed:
*                   type: number
*                   format: double
*                   example: 40000.00
*                   description: How much money was borrowed
*               paid:
*                   type: number
*                   format: double
*                   example: 15000.00
*                   description: How much money has been paid
*               interests:
*                   type: number
*                   format: double
*                   example: 1500.00
*                   description: How much money was paid as interests
*               isFinished:
*                   type: boolean
*                   example: false
*               payFrequency:
*                   $ref: "#/components/schemas/TPayFrequency"
*               userId:
*                   type: number
*                   format: integer
*                   description: DB Foreign Key - User ID.
*                   example: 1
*               bankId:
*                   type: number
*                   format: integer
*                   description: DB Foreign Key - Bank ID.
*                   example: 1
*           required:
*               - id
*               - name
*               - createdOn
*               - expires
*               - borrowed
*               - paid
*               - interests
*               - isFinished
*               - payFrequency
*               - userId
*               - bankId
*/
/** Interface used to have a representation of all attributes within the Loan Class */
export interface ILoan {
    /** DB Primary Key */
    id: number;
    /** e.g. BBVA Loan 10,000 May 2024 */
    name: string;
    /** When the loan was created in timestamp format */
    createdOn: number;
    /** Expiration date in timestamp format */
    expires: number;
    /** How much money was borrowed from the bank */
    borrowed: number;
    /** How much money has been paid */
    paid: number;
    /** How much money was paid as interests */
    interests: number;
    /** User already pay all the borrowed money */
    isFinished: boolean;
    /** If its payments are done semy weekly, weekly, semi monthly or monthly */
    payFrequency: TPayFrequency;

    /** DB Foreign Key - User ID */
    userId: number;
    /** DB Foreign Key - Bank ID */
    bankId: number;
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
*       CreateLoanPayload:
*           type: object
*           properties:
*               name:
*                   type: string
*                   example: Crédito Nissan Versa BBVA
*               expires:
*                   type: number
*                   example: 1732497156317
*                   description: Expiration date in timestamp utc format.
*               bankId:
*                   type: number
*                   format: integer
*                   description: DB Foreign Key - Bank ID.
*                   example: 1
*               borrowed:
*                   type: number
*                   format: double
*                   example: 40000.00
*               payFrequency:
*                   $ref: "#/components/schemas/TPayFrequency"
*           required:
*               - name
*               - expires
*               - bankId
*               - borrowed
*               - payFrequency
*/
/** Interface that defines all the attributes the payload for creating a new loan needs. */
export interface CreateLoanPayload {
    name: string;
    /** Expiration date in timestamp format */
    expires: number;
    /** DB Foreign Key - Bank ID */
    bankId: number;
    /** How much money was borrowed from the bank */
    borrowed: number;
    /** If its payments are done semy weekly, weekly, semi monthly or monthly */
    payFrequency: TPayFrequency;
}
