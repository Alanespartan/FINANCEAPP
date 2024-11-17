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
*               holderName:
*                   type: string
*               expires:
*                   type: string
*                   format: date
*               issuer:
*                   type: object
*                   $ref: "#/components/schemas/ContactInfo"
*               balance:
*                   type: number
*               alias
*                   type: string
*               limit:
*                   type: number
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
