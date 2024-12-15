/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TExpenseTypeFilter, UpdateExpenseSubCategoryPayload } from "@common/types/expenses";
import { MixinsConstructor, ExpenseSubCategory, User } from "@entities";
import { filterNonNullableAttributes } from "@backend/utils/functions";

export const ExpenseSubCategoriesMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        /**
        * Save a new expense sub category in user array.
        * @param {ExpenseSubCategory} toAdd New expense sub category object to save in user array
        */
        public addExpenseSubCategory(this: User, toAdd: ExpenseSubCategory): void {
            this.expenseSubCategories.push(toAdd);
        }
        /**
        * Checks if a expense sub category exists in user data.
        * @param {string | number} toSearch expense sub category name or id to search for
        * @param {string} field Type field to search for (name or id)
        * @returns {boolean} True or false whether the object exists or not
        */
        public hasExpenseSubCategory(this: User, toSearch: string | number, field: string): boolean {
            switch (field) {
                case "name": return this.expenseSubCategories.find((et) => et.name === (toSearch as string)) ? true : false;
                case "id": return this.expenseSubCategories.find((et) => et.id === (toSearch as number)) ? true : false;
                default: return false;
            }
        }
        /**
        * Get a specific stored expense sub category using its db id. Use hasExpenseSubCategory() first for safety check.
        * @param {number} toSearch expense sub category id to search for
        * @returns {ExpenseSubCategory} The desired expense sub category object
        */
        public getExpenseSubCategoryById(this: User, toSearch: number): ExpenseSubCategory {
            return this.expenseSubCategories.find((ec) => ec.id === toSearch) as ExpenseSubCategory;
        }
        /**
        * Get a specific stored expense sub category using its name. Use hasExpenseSubCategory() first for safety check.
        * @param {string} toSearch expense sub category name to search for
        * @returns {ExpenseSubCategory} The desired expense sub category object
        */
        public getExpenseSubCategoryByName(this: User, toSearch: string): ExpenseSubCategory {
            return this.expenseSubCategories.find((ec) => ec.name === toSearch) as ExpenseSubCategory;
        }
        /**
        * Get all stored user expense categories.
        * @param {TExpenseTypeFilter} type Used to filter user expense sub categories if a type was given in the request. Otherwise, it returns all expense sub categories the user has
        * @returns {ExpenseSubCategory[]} User expense categories array
        */
        public getExpenseSubCategories(this: User, type: TExpenseTypeFilter): ExpenseSubCategory[] {
            if(type !== 0) {
                return this.expenseSubCategories.filter((esc) => esc.type === type);
            }
            return this.expenseSubCategories;
        }
        /**
        * Get a desired stored expense sub category and update its attributes using a given set of options.
        * @param {number} id expense sub category id used to retrieve object from user data
        * @param {UpdateExpenseSubCategoryPayload} options Object containing the new values to assign
        * @returns {ExpenseSubCategory} Updated expense sub category object
        */
        public setOptionsIntoExpenseSubCategory(this: User, id: number, options: UpdateExpenseSubCategoryPayload): ExpenseSubCategory {
            // javascript handles objects by reference, by updating the expense sub category object here we dont need to update it in the endpoint
            const toUpdate = this.getExpenseSubCategoryById(id);

            // build payload from non null/undefined options
            const payload = filterNonNullableAttributes(options);
            // apply the new values from given options into desired expense sub category
            Object.entries(payload).forEach(([ key, value ]) => {
                if(key in toUpdate) {
                    toUpdate[key] = value;
                }
            });

            return toUpdate;
        }
    };
};
