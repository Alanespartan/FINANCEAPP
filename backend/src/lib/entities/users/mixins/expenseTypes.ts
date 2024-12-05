/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MixinsConstructor, ExpenseType, User } from "@entities";

export const ExpenseTypesMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        /**
        * Save a new expense type category in user array.
        * @param {ExpenseType} toAdd New Expense Type object to save in user array
        */
        public addExpenseType(this: User, toAdd: ExpenseType): void {
            this.expenseTypes.push(toAdd);
        }
        /**
        * Checks if a expense type exists in user data.
        * @param {string} toSearch Expense type name to search for
        * @returns {boolean} True or false whether the object exists or not
        */
        public hasExpenseType(this: User, toSearch: string): boolean {
            return this.expenseTypes.find((et) => et.name === toSearch) ? true : false;
        }
        /**
        * Get a specific stored expense type using its name to search for it. Use hasExpenseType() first for safety check.
        * @param {string} toSearch Expense type name to search for
        * @returns {ExpenseType} The desired Expense Type object
        */
        public getExpenseType(this: User, toSearch: string): ExpenseType {
            return this.expenseTypes.find((ec) => ec.name === toSearch) as ExpenseType;
        }
        /**
        * Get all stored user expense types.
        * @returns {ExpenseType[]} User expense types array
        */
        public getExpenseTypes(this: User): ExpenseType[] {
            return this.expenseTypes;
        }
    };
};
