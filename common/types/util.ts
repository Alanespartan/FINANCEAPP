/**
* @swagger
* components:
*   schemas:
*       IBank:
*           type: object
*           properties:
*               id:
*                   type: integer
*                   example: 1
*               name:
*                   type: string
*                   example: BBVA
*               country:
*                   type: string
*                   example: México
*           required:
*               - id
*               - name
*               - country
*/
/** Interface that serves as the representation of the issuer provider of cards, loans and saving accounts. */
export interface IBank {
    id: number;
    name: string;
    country: string;
}
