/**
* @swagger
* components:
*   schemas:
*       IBank:
*           type: object
*           properties:
*               name:
*                   type: string
*                   example: BBVA
*               country:
*                   type: string
*                   example: México
*           required:
*               - name
*               - country
*/
/** Interface that serves as the representation of the issuer provider of cards, loans and saving accounts. */
export interface IBank {
    name: string;
    country: string;
    phone?: string;
}
