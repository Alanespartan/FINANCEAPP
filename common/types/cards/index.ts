import { IUser } from "../users";
import { IBank } from "../util";

/**
* @swagger
* components:
*   schemas:
*       ECardTypes:
*           type: integer
*           description: Enum representing different types of card categories.
*           enum: [0, 1, 2, 3]
*           x-enum-varnames: [ALL, DEBIT, CREDIT, VOUCHER, SERVICES]
*           properties:
*               0:
*                   description: Represents all types of cards.
*               1:
*                   description: Debit card.
*               2:
*                   description: Credit card.
*               3:
*                   description: Services (e.g., AMEX PLATINUM).
*/
/** Enum used to identify all the possible cards the application can manipulate. */
export enum ECardTypes {
    ALL      = 0,
    DEBIT    = 1,
    CREDIT   = 2,
    SERVICES = 3 // e.g AMEX PLATINUM
}

/**
* @swagger
* components:
*   schemas:
*       ICard:
*           type: object
*           properties:
*               cardNumber:
*                   type: string
*                   description: The card number.
*                   example: 4815 6973 7892 1530
*               owner:
*                   $ref: "#/components/schemas/IUser"
*               alias:
*                   type: string
*                   description: The alias for the card.
*                   example: Visa (Crédito|Débito) BBVA Digital
*               expires:
*                   type: string
*                   format: date
*                   example: 2029-04-01
*                   description: The expiration date of the card.
*               issuer:
*                   $ref: "#/components/schemas/IBank"
*               balance:
*                   type: number
*                   format: double
*                   description: The balance available on the card.
*                   example: 4000.00
*               type:
*                   $ref: "#/components/schemas/ECardTypes"
*                   example: 2
*                   description: The type of card, represented as the value 2 from the ECardTypes enum.
*               archived:
*                   type: boolean
*                   example: false
*               limit:
*                   type: number
*                   format: double
*                   description: The credit limit in case the card is a credit card.
*                   example: 10000.00
*               isVoucher:
*                   type: boolean
*                   description: Indicates whether the card is a debit voucher card.
*           required:
*               - cardNumber
*               - owner
*               - alias
*               - expires
*               - issuer
*               - balance
*               - type
*               - archived
*/
/** Interface used to have a representation of all attributes within the Card Class */
export interface ICard {
    /** Card ID */
    cardNumber: string;
    owner: IUser;
    alias: string;
    expires: Date;
    issuer: IBank;
    balance: number;
    type: ECardTypes;
    archived: boolean;
    limit?: number;
    isVoucer?: boolean;
}

/*************************************/
/*********   HELPER SCHEMAS   ********/
/* e.g.                              */
/* - Request Payloads                */
/* - Basic Representation of Classes */
/*************************************/

/** Interface that serves as a basic representation of a user card. */
export interface SimpleCardOptions {
    cardNumber: string;
    alias: string;
}

/**
* @swagger
* components:
*   schemas:
*       CreateCardPayload:
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
*                   $ref: "#/components/schemas/IBank"
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
*               isVoucher:
*                   type: boolean
*                   example: false
*           required:
*               - cardNumber
*               - holderName
*               - expires
*               - issuer
*               - balance
*/
/** Interface that defines all the attributes the payload for creating a new user card needs. */
export interface CreateCardPayload {
    cardNumber: string;
    holderName: string;
    expires: Date;
    issuer: IBank;
    balance: number;
    alias?: string;
    limit?: number;
    isVoucher?: boolean;
}

/**
* @swagger
* components:
*   schemas:
*       UpdateCardPayload:
*           type: object
*           properties:
*               cardNumber:
*                   type: string
*                   description: The card number.
*                   example: 4815 6973 7892 1530
*               archived:
*                   type: boolean
*                   example: false
*               expires:
*                   type: string
*                   format: date
*                   example: 2029-04-01
*               type:
*                   $ref: "#/components/schemas/ECardTypes"
*                   example: 1
*                   description: The type of card, it can be either debit (1), credit (2) or service (3) card.
*               limit:
*                   type: number
*                   format: double
*                   description: The credit limit for the credit card.
*                   example: 10000.00
*               alias:
*                   type: string
*                   description: The alias for the card.
*                   example: Visa (Crédito|Débito) BBVA Digital
*/
/** Representes the expected and possible parameters during a PUT request to update a user card. */
export interface UpdateCardPayload {
    /** New card number. */
    cardNumber?: string;
    /** If user decides to delete a card, archived instead for data safety and governance. */
    archived?: boolean;
    expires?: Date;
    /** The type of card, it can be either debit (1), credit (2) or service (3) card. */
    type?: ECardTypes.DEBIT | ECardTypes.CREDIT | ECardTypes.SERVICES;
    /** This only must appear when dealing with credit cards. */
    limit?: number;
    /** If user set a new alias to the card. */
    alias?: string;
}
