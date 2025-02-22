import { TPayFrequency } from "../util";

/**
* @swagger
* components:
*   schemas:
*       CreateLoanPayload:
*           type: object
*           properties:
*               name:
*                   type: string
*                   example: BBVA Loan for Nissan Versa
*               expires:
*                   type: number
*                   example: 1832497156317
*                   description: Expiration date in timestamp utc format. Its the loan term the user has to pay for it
*               payFrequency:
*                   $ref: "#/components/schemas/TPayFrequency"
*               borrowed:
*                   type: number
*                   format: double
*                   example: 40000.00
*                   description: How much money was borrowed from the bank
*               fixedPaymentAmount:
*                   type: number
*                   format: double
*                   example: 2570.50
*                   description: How much money is planned to be paid each time the pay frequency established is met
*               interestsToPay:
*                   type: number
*                   format: double
*                   example: 5000.00
*                   description: How much money as interest is planned to be paid at the end of the term
*               annualInterestRate:
*                   type: number
*                   format: double
*                   example: 12.00
*                   description: Is the yearly interest rate charged on a loan. It's expressed as a percentage
*               bankId:
*                   type: number
*                   format: integer
*                   description: DB Foreign Key - Bank ID.
*                   example: 1
*           required:
*               - name
*               - expires
*               - payFrequency
*               - borrowed
*               - fixedPaymentAmount
*               - interestsToPay
*               - annualInterestRate
*               - bankId
*/
/** Keys of CreateLoanPayload interface */
export const CreateLoanRequiredKeys: (keyof CreateLoanPayload)[] = [
    "name", "expires", "payFrequency", "borrowed",
    "fixedPaymentAmount", "interestsToPay",
    "annualInterestRate", "bankId"
];
/** Interface that defines all the attributes within the payload for creating a new user loan. */
export interface CreateLoanPayload {
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
    /** DB Foreign Key - Bank ID */
    bankId: number;
}

/**
* @swagger
* components:
*   schemas:
*       UpdateLoanPayload:
*           type: object
*           properties:
*               name:
*                   type: string
*                   example: BBVA Loan for Nissan Versa
*               expires:
*                   type: number
*                   example: 1832497156317
*                   description: Expiration date in timestamp utc format. Its the loan term the user has to pay for it
*               payFrequency:
*                   $ref: "#/components/schemas/TPayFrequency"
*               borrowed:
*                   type: number
*                   format: double
*                   example: 40000.00
*                   description: How much money was borrowed from the bank
*               fixedPaymentAmount:
*                   type: number
*                   format: double
*                   example: 2570.50
*                   description: How much money is planned to be paid each time the pay frequency established is met
*               interestsToPay:
*                   type: number
*                   format: double
*                   example: 5000.00
*                   description: How much money as interest is planned to be paid at the end of the term
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
*/
/** Keys of UpdateLoanOptionalKeys interface */
export const UpdateLoanOptionalKeys: (keyof UpdateLoanPayload)[] = [
    "name", "expires", "payFrequency", "borrowed",
    "fixedPaymentAmount", "interestsToPay",
    "annualInterestRate", "isFinished", "archived"
];
/** Representes the expected and possible parameters during a PUT request to update a user loan. */
export interface UpdateLoanPayload {
    /** e.g. BBVA Loan 10,000 May 2024 */
    name?: string;
    /** Expiration date in timestamp format. Its the loan term the user has to pay for it */
    expires?: number;
    /** How much money was borrowed from the bank */
    borrowed?: number;
    /** How much money is planned to be paid each time the pay frequency established is met */
    fixedPaymentAmount?: number;
    /** How much money as interest is planned to be paid at the end of the term */
    interestsToPay?: number;
    /** Is the yearly interest rate charged on a loan. It's expressed as a percentage */
    annualInterestRate?: number;
    /** If user already pay all the borrowed money or not */
    isFinished?: boolean;
    /** If loan is active or not */
    archived?: boolean;
    /** If its payments are done semy weekly, weekly, semi monthly, monthly, etc. */
    payFrequency?: TPayFrequency;
}
