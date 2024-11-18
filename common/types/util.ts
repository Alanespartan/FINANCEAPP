/**
* @swagger
* components:
*   schemas:
*       Bank:
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
export interface Bank {
    name: string;
    // contact information
    country: string;
    phone?: string;
}
