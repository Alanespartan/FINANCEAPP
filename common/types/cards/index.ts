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
*           enum: [1, 2, 3]
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
*               id:
*                   type: number
*                   format: integer
*                   description: DB Primary Key
*                   example: 1
*               cardNumber:
*                   type: string
*                   description: DB Unique ID.
*                   example: 4815 6973 7892 1530
*               name:
*                   type: string
*                   description: The name of the card.
*                   example: Visa (Crédito|Débito) BBVA Digital
*               expires:
*                   type: number
*                   example: 1732497156317
*                   description: Expiration date in timestamp utc format.
*               cutOffDate:
*                   type: number
*                   example: 23
*                   description: The final day to record transactions in a financial statement.
*               balance:
*                   type: number
*                   format: double
*                   description: Available money in card.
*                   example: 4000.00
*               type:
*                   $ref: "#/components/schemas/TCardTypes"
*                   example: 2
*                   description: Card Type (Debit = 1 | Credit = 2 | Services = 3)
*               paymentDate:
*                   type: number
*                   example: 13
*                   description: If card is credit, the final day to pay the monthly pending balance.
*               archived:
*                   type: boolean
*                   example: false
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
*               limit:
*                   type: number
*                   format: double
*                   description: The credit limit in case the card is a credit card.
*                   example: 10000.00
*               isVoucher:
*                   type: boolean
*                   description: Indicates whether the card is a debit voucher card.
*           required:
*               - id
*               - cardNumber
*               - name
*               - expires
*               - cutOffDate
*               - balance
*               - type
*               - paymentDate
*               - archived
*               - limit
*               - isVoucher
*               - userId
*               - bankId
*/
/** Interface used to have a representation of all attributes within the Card Class */
export interface ICard {
    /** DB Primary Key */
    id: number;
    /** DB Unique ID */
    cardNumber: string;
    /** Users can assign a custom name to their cards */
    name: string;
    /** Expiration date in timestamp format */
    expires: number;
    /** The final day to record transactions in a financial statement.  */
    cutOffDate: number;
    /** Available money in card */
    balance: number;
    /** Card Type (Debit = 1 | Credit = 2 | Services = 3) */
    type: TCardTypes;
    /** DB Foreign Key - User ID */
    userId: number;
    /** DB Foreign Key - Bank ID */
    bankId: number;

    /** If card is credit, the final day to pay the monthly pending balance. */
    paymentDate: number;
    /** If card is active or not */
    archived: boolean;
    /** If card is credit, it must have a limit */
    limit: number;
    /** Is card a voucher card given by employer? */
    isVoucher: boolean;
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
*                   description: This will be DB Unique ID
*               expires:
*                   type: number
*                   example: 1732497156317
*                   description: Expiration date in timestamp format.
*               type:
*                   $ref: "#/components/schemas/TCardTypes"
*                   example: 1
*                   description: The type of card, it can be either debit (1), credit (2) or service (3) card.
*               bankId:
*                   type: number
*                   format: integer
*                   example: 1
*                   description: DB Foreign Key - Bank ID
*               balance:
*                   type: number
*                   format: double
*                   example: 4000.00
*                   description: How many money the card has when created
*               cutOffDate:
*                   type: number
*                   example: 23
*                   description: The final day to record transactions in a financial statement.
*               paymentDate:
*                   type: number
*                   example: 13
*                   description: If card is credit, the final day to pay the monthly pending balance.
*               name:
*                   type: string
*                   example: Visa Crédito BBVA Digital
*               limit:
*                   type: number
*                   format: double
*                   example: 10000.00
*                   description: If card is credit, how much is its limit
*               isVoucher:
*                   type: boolean
*                   example: false
*                   description: Is card a voucher card given by employer?
*           required:
*               - cardNumber
*               - expires
*               - type
*               - bankId
*               - balance
*/
/** Interface that defines all the attributes the payload for creating a new user card needs. */
export interface CreateCardPayload {
    /** This will be DB Unique ID */
    cardNumber: string;
    /** Expiration date in timestamp format */
    expires: number;
    /** The type of card, it can be either debit (1), credit (2) or service (3) card. */
    type: TCardTypes;
    /** DB Foreign Key - Bank ID */
    bankId: number;
    /** How many money the card has when created  */
    balance: number;
    /** If card is credit, the final day to record transactions in a financial statement. */
    cutOffDate?: number;
    /** If card is credit, the final day to pay the monthly pending balance. */
    paymentDate?: number;
    /** Users can assign a custom name to their cards */
    name?: string;
    /** If card is credit, how much is its limit */
    limit?: number;
    /** Is a voucher card given by employer? */
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
*                   example: 1869696000000
*                   description: The expiration date of the card in timestamp format.
*               cutOffDate:
*                   type: number
*                   example: 23
*                   description: If card is credit, the final day to record transactions in a financial statement.
*               paymentDate:
*                   type: number
*                   example: 13
*                   description: If card is credit, the final day to pay the monthly pending balance.
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
*               isVoucher:
*                   type: boolean
*                   description: Indicates whether the card is a debit voucher card.
*/
/** Representes the expected and possible parameters during a PUT request to update a user card. */
export interface UpdateCardPayload {
    /** New card number. */
    cardNumber?: string;
    /** If user decides to delete a card, archived instead for data safety and governance. */
    archived?: boolean;
    /** New expiration date in timestamp format */
    expires?: number;
    /** The type of card, it can be either debit (1), credit (2) or service (3) card. */
    type?: TCardTypes;
    /** This only must appear when dealing with credit cards. */
    limit?: number;
    /** If user set a new name to the card. */
    name?: string;
    /** Is card a voucher card given by employer? */
    isVoucher?: boolean;
    /** If card is credit, the final day to record transactions in a financial statement.  */
    cutOffDate?: number;
    /** If card is credit, the final day to pay the monthly pending balance. */
    paymentDate?: number;
}
