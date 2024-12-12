import { TPayFrequency } from "../util";

/**
* @swagger
* components:
*   schemas:
*       ILoan:
*           type: object
*           properties:
*               id:
*                   type: number
*                   format: integer
*                   description: DB Primary Key
*                   example: 1
*               name:
*                   type: string
*                   example: BBVA Loan for Nissan Versa
*               createdOn:
*                   type: number
*                   example: 1682497156317
*                   description: When the loan was created in timestamp utc format
*               expires:
*                   type: number
*                   example: 1732497156317
*                   description: Expiration date in timestamp utc format. Its the loan term the user has to pay for it
*               fixedPaymentAmount:
*                   type: number
*                   format: double
*                   example: 2570.50
*                   description: How much money is planned to be paid each time the pay frequency established is met
*               borrowed:
*                   type: number
*                   format: double
*                   example: 40000.00
*                   description: How much money was borrowed from the bank
*               interestsToPay:
*                   type: number
*                   format: double
*                   example: 5000.00
*                   description: How much money as interest is planned to be paid at the end of the term
*               interestsPaid:
*                   type: number
*                   format: double
*                   example: 6300.75
*                   description: How much money has been paid as interest
*               totalPaid:
*                   type: number
*                   format: double
*                   example: 15000.00
*                   description: How much money in total has been paid
*               annualInterestRate:
*                   type: number
*                   format: double
*                   example: 12.00
*                   description: Is the yearly interest rate charged on a loan. It's expressed as a percentage
*               isFinished:
*                   type: boolean
*                   example: false
*                   description: If user already pay all the borrowed money or not
*               archived:
*                   type: boolean
*                   example: false
*                   description: If loan is active or not
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
*               - fixedPaymentAmount
*               - borrowed
*               - interestsToPay
*               - interestsPaid
*               - totalPaid
*               - annualInterestRate
*               - isFinished
*               - archived
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
    /** Expiration date in timestamp format. Its the loan term the user has to pay for it */
    expires: number;
    /** If its payments are done semy weekly, weekly, semi monthly, monthly, etc. */
    payFrequency: TPayFrequency;
    /** How much money was borrowed from the bank */
    borrowed: number;
    /** How much money is planned to be paid each time the pay frequency established is met */
    fixedPaymentAmount: number;
    /** How much money as interest is planned to be paid at the end of the term */
    interestsToPay: number;
    /** Is the yearly interest rate charged on a loan. It's expressed as a percentage */
    annualInterestRate: number;


    /** How much money in total has been paid */
    totalPaid: number;
    /** How much money has been paid as interest */
    interestsPaid: number;
    /** If user already pay all the borrowed money or not */
    isFinished: boolean;
    /** If loan is active or not */
    archived: boolean;
    /** When the loan was created in timestamp utc format */
    createdOn: number;


    /** DB Foreign Key - User ID */
    userId: number;
    /** DB Foreign Key - Bank ID */
    bankId: number;
}
