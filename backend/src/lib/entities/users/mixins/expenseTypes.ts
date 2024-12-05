/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MixinsConstructor, ExpenseType } from "@entities";

export const ExpenseTypesMixin = <TBase extends MixinsConstructor>(Base: TBase) => {
    return class extends Base {
        /** All expense types the user has registered */
        public expenseTypes: ExpenseType[] | undefined;

        /**
        * Save a new expense type category in user array.
        * @param toAdd New Expense Type Object to save in user array
        */
        public addExpenseType(toAdd: ExpenseType): void {
            this.expenseTypes!.push(toAdd);
        }
        /**
        * Checks if a expense type already exists in user data.
        * @param toSearch Expense type name to search for.
        */
        public hasExpenseType(toSearch: string): boolean {
            return this.expenseTypes!.find((et) => et.name === toSearch) ? true : false;
        }
        /**
        * Helper function that obtains the desired expense type.
        * @param name Expense type name to search for.
        */
        public getExpenseType(name: string): ExpenseType {
            return this.expenseTypes!.find((ec) => ec.name === name) as ExpenseType;
        }
        /**
        * Get all stored user expense types.
        */
        public getExpenseTypes(): ExpenseType[] {
            return this.expenseTypes as ExpenseType[];
        }
    };
};
