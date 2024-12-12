/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { UpdateExpenseCategoryPayload } from "@common/types/expenses";
import { MixinsConstructor, ExpenseCategory, User } from "@entities";
import { filterNonNullableAttributes } from "@entities/expenses/functions/util";

export const ExpenseCategoriesMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        /**
        * Save a new expense category in user array.
        * @param {ExpenseCategory} toAdd New expense category object to save in user array
        */
        public addExpenseCategory(this: User, toAdd: ExpenseCategory): void {
            this.expenseCategories.push(toAdd);
        }
        /**
        * Checks if a expense category exists in user data.
        * @param {string | number} toSearch Expense category name or id to search for
        * @param {string} field Type field to search for (name or id)
        * @returns {boolean} True or false whether the object exists or not
        */
        public hasExpenseCategory(this: User, toSearch: string | number, field: string): boolean {
            switch (field) {
                case "name": return this.expenseCategories.find((et) => et.name === (toSearch as string)) ? true : false;
                case "id": return this.expenseCategories.find((et) => et.id === (toSearch as number)) ? true : false;
                default: return false;
            }
        }
        /**
        * Get a specific stored expense category using its db id. Use hasExpenseCategory() first for safety check.
        * @param {number} toSearch Expense category id to search for
        * @returns {ExpenseCategory} The desired expense category object
        */
        public getExpenseCategoryById(this: User, toSearch: number): ExpenseCategory {
            return this.expenseCategories.find((ec) => ec.id === toSearch) as ExpenseCategory;
        }
        /**
        * Get a specific stored expense category using its name. Use hasExpenseCategory() first for safety check.
        * @param {string | number} toSearch Expense category name to search for
        * @returns {ExpenseCategory} The desired expense category object
        */
        public getExpenseCategoryByName(this: User, toSearch: string): ExpenseCategory {
            return this.expenseCategories.find((ec) => ec.name === toSearch) as ExpenseCategory;
        }
        /**
        * Get all stored user expense categories.
        * @returns {ExpenseCategory[]} User expense categories array
        */
        public getExpenseCategories(this: User): ExpenseCategory[] {
            return this.expenseCategories;
        }
        /**
        * Get a desired stored card and update its attributes using a given set of options.
        * @param {number} id Expense category id used to retrieve object from user data
        * @param {UpdateExpenseCategoryPayload} options Object containing the new values to assign
        * @returns {ExpenseCategory} Updated expense category object
        */
        public setOptionsIntoExpenseCategory(this: User, id: number, options: UpdateExpenseCategoryPayload): ExpenseCategory {
            // javascript handles objects by reference, by updating the expense category object here we dont need to update it in the endpoint
            const toUpdate = this.getExpenseCategoryById(id);

            // build payload from non null/undefined options
            const payload = filterNonNullableAttributes(options);
            // apply the new values from given options into desired expense category
            Object.entries(payload).forEach(([ key, value ]) => {
                if(key in toUpdate) {
                    toUpdate[key] = value;
                }
            });

            return toUpdate;
        }
    };
};
