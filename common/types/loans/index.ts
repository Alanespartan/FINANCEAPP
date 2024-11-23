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
*                   example: 1
*               name:
*                   type: string
*                   example: Crédito Nissan Versa BBVA
*               owner:
*                   $ref: "#/components/schemas/IUser"
*               issuer:
*                   $ref: "#/components/schemas/IBank"
*               createdOn:
*                   type: string
*                   format: date
*                   example: 2029-04-01
*               expires:
*                   type: string
*                   format: date
*                   example: 2029-04-01
*               borrowed:
*                   type: number
*                   format: double
*                   example: 40000.00
*               paid:
*                   type: number
*                   format: double
*                   example: 15000.00
*               interests:
*                   type: number
*                   format: double
*                   example: 1500.00
*               isFinished:
*                   type: boolean
*                   example: false
*               payFrequency:
*                   $ref: "#/components/schemas/TPayFrequency"
*           required:
*               - id
*               - name
*               - owner
*               - issuer
*               - createdOn
*               - expires
*               - borrowed
*               - paid
*               - interests
*               - isFinished
*               - payFrequency
*/
/** Interface used to have a representation of all attributes within the Loan Class */
export interface ILoan {
    id: number;
    name: string;
    owner: IUser;
    issuer: IBank;
    createdOn: Date;
    expires: Date;
    borrowed: number;
    paid: number;
    interests: number;
    isFinished: boolean;
    payFrequency: TPayFrequency;
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
*                   type: string
*                   format: date
*                   example: 2029-04-01
*               issuer:
*                   $ref: "#/components/schemas/IBank"
*               borrowed:
*                   type: number
*                   format: double
*                   example: 40000.00
*               payFrequency:
*                   $ref: "#/components/schemas/TPayFrequency"
*           required:
*               - alias
*               - expires
*               - issuer
*               - borrowed
*/
/** Interface that defines all the attributes the payload for creating a new loan needs. */
export interface CreateLoanPayload {
    name: string;
    expires: Date;
    issuer: IBank;
    borrowed: number;
    payFrequency: TPayFrequency;
}
