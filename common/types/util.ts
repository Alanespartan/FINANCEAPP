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

/**
* @swagger
* components:
*   schemas:
*       OEPayFrequency:
*           type: integer
*           description: Object Enum representing all the pay frenquency options available.
*           enum: [0, 1, 2, 3]
*           x-enum-varnames: [SemiWeekly, Weekly, SemiMonthly, Monthly]
*           properties:
*               0:
*                   description: Twice a week
*               1:
*                   description: Every week
*               2:
*                   description: Twice a month
*               3:
*                   description: Every month
*/
/** Enum used to identify all the possible cards the application can manipulate. */
/** Object Enum representing all the pay frenquency options available. */
export const OEPayFrequency = {
    /** Twice a week (Every wednesday and friday): 104 pay checks per year. */
    SemiWeekly: 0,
    /** Every week (Last friday): 52 pay checks per year. */
    Weekly: 1,
    /** Twice a month (1st n 15th or 15th n 30th of every month): 24 pay checks per year. */
    SemiMonthly: 2,
    /** Every month (Last working day): 12 pay checks per year. */
    Monthly: 3
} as const;


