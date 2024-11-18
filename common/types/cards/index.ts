import { Bank } from "../util";

export enum CardTypes {
    ALL      = 0,
    DEBIT    = 1,
    CREDIT   = 2,
    VOUCHER  = 3, // SiVale
    SERVICES = 5 // e.g AMEX PLATINUM
}

/**
* @swagger
* components:
*   schemas:
*       CardOptions:
*           type: object
*           properties:
*               cardNumber:
*                   type: string
*                   example: 4815 6973 7892 1530
*               holderName:
*                   type: string
*                   example: Juan Arturo Cruz Cardona
*               expires:
*                   type: string
*                   format: date
*                   example: 2029-04-01
*               issuer:
*                   $ref: "#/components/schemas/Bank"
*               balance:
*                   type: number
*                   example: 4000
*               alias:
*                   type: string
*                   example: Visa Crédito BBVA Digital
*               limit:
*                   type: number
*                   example: 10000
*           required:
*               - cardNumber
*               - holderName
*               - expires
*               - issuer
*               - balance
*/
/** Interface that serves as the payload for creating a new user card. */
export interface CardOptions {
    cardNumber: string;
    holderName: string;
    expires: Date;
    issuer: Bank;
    balance: number;
    alias?: string;
    limit?: number;
}

/** User deactivates digital card and issues a new one.
 * The bank, limit, current balance and names remain the same as before.
 * There is a new date, a new card number and a possible new alias. */
export interface UpdateCardOptions {
    cardNumber: string;
    expires: Date;
    alias?: string;
}
