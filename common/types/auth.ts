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
*       LoginPayload:
*           type: object
*           properties:
*               email:
*                   type: string
*                   example: test@gmail.com
*               password:
*                   type: string
*                   example: admin
*           required:
*               - email
*               - password
*/
/** Interface used to have a representation of all attributes needed to perform a sucessful log in. */
export interface LoginPayload {
    email: string;
    password: string; // TODO AUTH hash login password
}

/**
* @swagger
* components:
*   schemas:
*       SignUpPayload:
*           type: object
*           properties:
*               firstName:
*                   type: string
*                   example: John
*               lastName:
*                   type: string
*                   example: Doe
*               email:
*                   type: string
*                   example: test@gmail.com
*               password:
*                   type: string
*                   example: admin
*           required:
*               - firstName
*               - lastName
*               - email
*               - password
*/
/** Interface used to have a representation of all attributes needed to create a new account. */
export interface SignUpPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string; // TODO AUTH hash signup password
}

