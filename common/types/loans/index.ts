import { IUser } from "../users";
import { IBank } from "../util";

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
*               alias:
*                   type: string
*                   description: The alias for the card.
*                   example: Visa (Crédito|Débito) BBVA Digital
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
*               - holderName
*               - expires
*               - issuer
*               - balance
*               - type
*               - archived
*/
/** Interface used to have a representation of all attributes within the Card Class */
export interface ILoan {
    id: string;
    name: string; // default is bank name + borrowed number but can be updated by set by user
    owner: IUser;
    issuer: IBank;
    expires: Date;
    borrowed: number;
    paid: number;
    isFinished: boolean;
    interests: number;
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
/** Interface that defines all the attributes the payload for creating a new loan needs. */
export interface CreateLoanPayload {
    holderName: string;
    expires: Date;
    issuer: IBank;
    borrowed: number;
    alias: string;
    limit?: number;
}
