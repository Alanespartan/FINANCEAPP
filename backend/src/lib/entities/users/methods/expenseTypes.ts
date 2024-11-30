import { User, ExpenseType } from "@entities";

/**
* Save a new expense category in user information.
* @param {ExpenseType} toAdd Contains information of new expense category.
*/
export function addExpenseType(this: User, toAdd: ExpenseType) {
    this.expenseTypes.push(toAdd);
}

/**
* Helper function that obtains the desired expense type.
* @param {string} name Expense type name to search for.
*/
export function getExpenseType(this: User, name: string) {
    return this.expenseTypes.find((ec) => ec.name === name);
}

/**
* Get all stored user expense types.
*/
export function getExpenseTypes(this: User) {
    return this.expenseTypes;
}
