import { ICard } from "../cards";

/**
* @swagger
* components:
*   schemas:
*       IUser:
*           type: object
*           properties:
*               id:
*                   type: number
*                   example: 1
*               email:
*                   type: string
*                   example: test@gmail.com
*               firstName:
*                   type: string
*                   example: John
*               lastName:
*                   type: string
*                   example: Doe
*               cards:
*                   type: array
*                   items:
*                       $ref: "#/components/schemas/ICard"
*           required:
*               - id
*               - email
*               - firstName
*               - lastName
*               - cards
*/
/** Interface used to have a representation of all attributes within the User Class */
export interface IUser {
    id: number; // used to match with user data from db
    email: string;
    firstName: string;
    lastName: string;
    cards: ICard[];
}

/**
* @swagger
* components:
*   schemas:
*       ISimpleUser:
*           type: object
*           properties:
*               id:
*                   type: number
*                   example: 1
*               email:
*                   type: string
*                   example: test@gmail.com
*               firstName:
*                   type: string
*                   example: John
*               lastName:
*                   type: string
*                   example: Doe
*           required:
*               - id
*               - email
*               - firstName
*               - lastName
*/
/** Interface used to have a simple representation of a User and its essential attributes. */
export interface ISimpleUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}
