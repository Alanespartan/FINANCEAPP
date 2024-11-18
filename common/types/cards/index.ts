import { Bank } from "../util";

/**
* @swagger
* components:
*   schemas:
*       CardTypes:
*           type: integer
*           description: Enum representing different types of card categories.
*           enum: [0, 1, 2, 3, 4]
*           x-enum-varnames: [ALL, DEBIT, CREDIT, VOUCHER, SERVICES]
*           properties:
*               0:
*                   description: Represents all types of cards.
*               1:
*                   description: Debit card.
*               2:
*                   description: Credit card.
*               3:
*                   description: Voucher (e.g., SiVale).
*               4:
*                   description: Services (e.g., AMEX PLATINUM).
*/
/** Enum used to identify all the possible cards the application can manipulate. */
export enum CardTypes {
    ALL      = 0,
    DEBIT    = 1,
    CREDIT   = 2,
    VOUCHER  = 3, // SiVale
    SERVICES = 4 // e.g AMEX PLATINUM
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
*                   format: double
*                   example: 4000.00
*               alias:
*                   type: string
*                   example: Visa Crédito BBVA Digital
*               limit:
*                   type: number
*                   format: double
*                   example: 10000.00
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

/**
* @swagger
* components:
*   schemas:
*       Card:
*           type: object
*           properties:
*               cardNumber:
*                   type: string
*                   description: The card number.
*                   example: 4815 6973 7892 1530
*               alias:
*                   type: string
*                   description: The alias for the card.
*                   example: Visa Crédito BBVA Digital
*               holderName:
*                   type: string
*                   description: The name of the cardholder.
*                   example: Juan Arturo Cruz Cardona
*               expires:
*                   type: string
*                   format: date
*                   example: 2029-04-01
*                   description: The expiration date of the card.
*               issuer:
*                   $ref: "#/components/schemas/Bank"
*               balance:
*                   type: number
*                   format: double
*                   description: The balance available on the card.
*                   example: 4000.00
*               type:
*                   $ref: "#/components/schemas/CardTypes"
*                   description: The type of card, represented as an enum value.
*           required:
*               - cardNumber
*               - alias
*               - holderName
*               - expires
*               - issuer
*               - balance
*               - type
*/
/** Interface used to have a representation of all attributes within the Card Class */
export interface Card {
    cardNumber: string,
    alias: string,
    holderName: string,
    expires: Date,
    issuer: Bank,
    balance: number,
    type: number
}

/**
* @swagger
* components:
*   schemas:
*       CreditCard:
*           allOf:
*               - $ref: "#/components/schemas/Card"
*               - type: object
*                 properties:
*                   limit:
*                       type: number
*                       format: double
*                       description: The credit limit for the credit card.
*                       example: 10000.00
*                 required:
*                   - limit
*/
/** Interface used to have a representation of all attributes within the CreditCard Class */
export interface CreditCard extends Card {
    limit: number;
}

/**
* @swagger
* components:
*   schemas:
*       DebitCard:
*           allOf:
*               - $ref: "#/components/schemas/Card"
*               - type: object
*                 properties:
*                   isVoucher:
*                       type: boolean
*                       description: Indicates whether the debit card is a voucher card.
*                 required:
*                   - isVoucher
*/
/** Interface used to have a representation of all attributes within the DebitCard Class */
export interface DebitCard extends Card {
    isVoucher: boolean;
}

/**
* @swagger
* components:
*   schemas:
*       AvailableCards:
*           anyOf:
*               - $ref: "#/components/schemas/CreditCard"
*               - $ref: "#/components/schemas/DebitCard"
*           description: Represents a possible type of either DebitCard or CreditCard.
*/
export type AvailableCards = DebitCard | CreditCard;

/** User deactivates digital card and issues a new one.
 * The bank, limit, current balance and names remain the same as before.
 * There is a new date, a new card number and a possible new alias. */
export interface UpdateCardOptions {
    cardNumber: string;
    expires: Date;
    alias?: string;
}
