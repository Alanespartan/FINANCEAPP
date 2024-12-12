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
*                   example: Crédito Nissan Versa BBVA
*               expires:
*                   type: number
*                   example: 1732497156317
*                   description: Expiration date in timestamp utc format.
*               bankId:
*                   type: number
*                   format: integer
*                   description: DB Foreign Key - Bank ID.
*                   example: 1
*               borrowed:
*                   type: number
*                   format: double
*                   example: 40000.00
*               payFrequency:
*                   $ref: "#/components/schemas/TPayFrequency"
*           required:
*               - name
*               - expires
*               - bankId
*               - borrowed
*               - payFrequency
*/
/** Interface that defines all the attributes the payload for creating a new loan needs. */
export interface CreateLoanPayload {
    name: string;
    /** Expiration date in timestamp format */
    expires: number;
    /** DB Foreign Key - Bank ID */
    bankId: number;
    /** How much money was borrowed from the bank */
    borrowed: number;
    /** If its payments are done semy weekly, weekly, semi monthly or monthly */
    payFrequency: TPayFrequency;
}
