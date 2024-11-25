/**
* @swagger
* components:
*   schemas:
*       TCardFilters:
*           type: integer
*           description: A multi-option type representing all the available card types a user can filter for.
*           enum: [0, 1, 2, 3]
*           x-enum-varnames: [ALL, DEBIT, CREDIT, SERVICES]
*           properties:
*               0:
*                   description: Represents all types of cards.
*               1:
*                   description: Debit card.
*               2:
*                   description: Credit card.
*               3:
*                   description: Services (e.g., AMEX PLATINUM).
*       TCardTypes:
*           type: integer
*           description: A multi-option type representing all the available card types a user can create.
*           enum: [0, 1, 2, 3]
*           x-enum-varnames: [ALL, DEBIT, CREDIT, SERVICES]
*           properties:
*               1:
*                   description: Debit card.
*               2:
*                   description: Credit card.
*               3:
*                   description: Services (e.g., AMEX PLATINUM).
*/
/** Object Enum representing all the possible cards the application can manipulate. */
export const OECardTypesFilters = {
    ALL: 0,
    DEBIT: 1,
    CREDIT: 2,
    SERVICES: 3
} as const;
/** A multi-option type representing all the available card types a user can create. */
export type TCardTypes = typeof OECardTypesFilters.DEBIT | typeof OECardTypesFilters.CREDIT | typeof OECardTypesFilters.SERVICES;
/** A multi-option type representing all the available card types a user can filter for. */
export type TCardFilters = typeof OECardTypesFilters.ALL | TCardTypes;

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
*               name:
*                   type: string
*                   description: The name of the card.
*                   example: Visa (Crédito|Débito) BBVA Digital
*               expires:
*                   type: number
*                   example: 1732497156317
*                   description: The expiration date of the card in timestamp format.
*               ownerId:
*                   type: number
*                   format: integer
*                   description: The associated user id.
*                   example: 1
*               issuerId:
*                   type: number
*                   format: integer
*                   description: The associated bank id.
*                   example: 1
*               balance:
*                   type: number
*                   format: double
*                   description: The balance available on the card.
*                   example: 4000.00
*               type:
*                   $ref: "#/components/schemas/TCardTypes"
*                   example: 2
*                   description: The type of card, represented as the value 2 from the TCardTypes enum.
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
*               - name
*               - expires
*               - ownerId
*               - issuerId
*               - balance
*               - type
*               - archived
*/
/** Interface used to have a representation of all attributes within the Card Class */
export interface ICard {
    /** Card ID */
    cardNumber: string;
    name: string;
    /** Date timestamp */
    expires: number;
    /** User ID */
    ownerId: number;
    /** Bank ID */
    issuerId: number;
    balance: number;
    type: TCardTypes;
    archived: boolean;
    limit?: number;
    isVoucher?: boolean;
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
*               expires:
*                   type: string
*                   format: date
*                   example: 2029-04-01
*               issuerId:
*                   type: number
*                   format: integer
*                   example: 1
*               balance:
*                   type: number
*                   format: double
*                   example: 4000.00
*               name:
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
*               - expires
*               - issuerId
*               - balance
*/
/** Interface that defines all the attributes the payload for creating a new user card needs. */
export interface CreateCardPayload {
    cardNumber: string;
    expires: Date;
    issuerId: number;
    balance: number;
    name?: string;
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
*                   type: number
*                   example: 1732497156317
*                   description: The expiration date of the card in timestamp format.
*               type:
*                   $ref: "#/components/schemas/TCardTypes"
*                   example: 1
*                   description: The type of card, it can be either debit (1), credit (2) or service (3) card.
*               limit:
*                   type: number
*                   format: double
*                   description: The credit limit for the credit card.
*                   example: 10000.00
*               name:
*                   type: string
*                   description: The name of the card.
*                   example: Visa (Crédito|Débito) BBVA Digital
*/
/** Representes the expected and possible parameters during a PUT request to update a user card. */
export interface UpdateCardPayload {
    /** New card number. */
    cardNumber?: string;
    /** If user decides to delete a card, archived instead for data safety and governance. */
    archived?: boolean;
    expires?: number;
    /** The type of card, it can be either debit (1), credit (2) or service (3) card. */
    type?: TCardTypes;
    /** This only must appear when dealing with credit cards. */
    limit?: number;
    /** If user set a new name to the card. */
    name?: string;
}
