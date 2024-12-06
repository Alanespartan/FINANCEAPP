import { OETypesOfExpense } from "./enums";

/**
* @swagger
* components:
*   schemas:
*       TExpenseType:
*           type: integer
*           description: A multi-option type representing all the available Expense Types a user can create. Real Expense (1), Card (2) or Loan (3)
*           enum: [1, 2, 3]
*           x-enum-varnames: [REALEXPENSE, CARD, LOAN]
*           properties:
*               1:
*                   description: If what you are paying is a real expense (e.g. Cards - Loans - Insurances - Online Suscriptions - Transport - Gaming)
*               2:
*                   description: If what you are paying is a card.
*               3:
*                   description: If what you are paying is a loan.
*       TExpenseTypeFilter:
*           type: integer
*           description: A multi-option type representing all the available Expense Types a user can filter for.
*           enum: [0, 1, 2, 3]
*           x-enum-varnames: [ALL, REALEXPENSE, CARD, LOAN]
*           properties:
*               0:
*                   description: Represents all types of expense type.
*               1:
*                   description: If what you are paying is a real expense (e.g. Cards - Loans - Insurances - Online Suscriptions - Transport - Gaming)
*               2:
*                   description: If what you are paying is a card.
*               3:
*                   description: If what you are paying is a loan.
*/
/** A multi-option type representing all the available Expense Types a user ha. Real Expense (1), Card (2) or Loan (3) */
export type TExpenseType = typeof OETypesOfExpense.REALEXPENSE | typeof OETypesOfExpense.CARD | typeof OETypesOfExpense.LOAN;
/** A multi-option type representing all the available Expense Types a user can filter for. */
export type TExpenseTypeFilter = typeof OETypesOfExpense.ALL | TExpenseType;
