/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TExpenseTypeFilter, UpdateExpenseTypePayload } from "@common/types/expenses";
import { MixinsConstructor, ExpenseType, User } from "@entities";
import { filterNonNullableAttributes } from "@entities/expenses/functions/util";

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
        * @param {string | number} toSearch Expense type name or id to search for
        * @param {string} field Expense type field to search for (name or id)
        * @returns {boolean} True or false whether the object exists or not
        */
        public hasExpenseType(this: User, toSearch: string | number, field: string): boolean {
            switch (field) {
                case "name": return this.expenseTypes.find((et) => et.name === (toSearch as string)) ? true : false;
                case "id": return this.expenseTypes.find((et) => et.id === (toSearch as number)) ? true : false;
                default: return false;
            }
        }
        /**
        * Get a specific stored expense type using its db id. Use hasExpenseType() first for safety check.
        * @param {number} toSearch Expense type id to search for
        * @returns {ExpenseType} The desired Expense Type object
        */
        public getExpenseTypeById(this: User, toSearch: number): ExpenseType {
            return this.expenseTypes.find((ec) => ec.id === toSearch) as ExpenseType;
        }
        /**
        * Get a specific stored expense type using its name. Use hasExpenseType() first for safety check.
        * @param {string | number} toSearch Expense type name to search for
        * @returns {ExpenseType} The desired Expense Type object
        */
        public getExpenseTypeByName(this: User, toSearch: string): ExpenseType {
            return this.expenseTypes.find((ec) => ec.name === toSearch) as ExpenseType;
        }
        /**
        * Get all stored user expense types.
        * @returns {ExpenseType[]} User expense types array
        */
        public getExpenseTypes(this: User, type: TExpenseTypeFilter): ExpenseType[] {
            if(type !== 0) {
                return this.expenseTypes.filter((et) => et.type === type);
            }
            return this.expenseTypes;
        }
        /**
        * Get a desired stored card and update its attributes using a given set of options.
        * @param {number} id Expense type id used to retrieve object from user data
        * @param {UpdateExpenseTypePayload} options Object containing the new values to assign
        * @returns {ExpenseType} Updated expense type object
        */
        public setOptionsIntoExpenseType(this: User, id: number, options: UpdateExpenseTypePayload): ExpenseType {
            // javascript handles objects by reference, by updating the expense type object here we dont need to update it in the endpoint
            const toUpdate = this.getExpenseTypeById(id);

            // build payload from non null/undefined options
            const payload = filterNonNullableAttributes(options);
            // apply the new values from given options into desired expense type
            Object.entries(payload).forEach(([ key, value ]) => {
                if(key in toUpdate) {
                    toUpdate[key] = value;
                }
            });

            return toUpdate;
        }
    };
};
