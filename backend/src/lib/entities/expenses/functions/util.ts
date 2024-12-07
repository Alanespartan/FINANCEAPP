/* eslint-disable @typescript-eslint/no-explicit-any */
import { OETypesOfExpense, TExpenseType, TExpenseTypeFilter, UpdateExpenseCategoryPayload, UpdateExpenseSubCategoryPayload } from "@common/types/expenses";

export const isValidExpenseSubCategory = (value: number): value is TExpenseType => {
    return value === OETypesOfExpense.REALEXPENSE
        || value === OETypesOfExpense.CARD
        || value === OETypesOfExpense.LOAN;
};

export const isValidRealExpense = (value: number): value is TExpenseType => {
    return value === OETypesOfExpense.REALEXPENSE;
};

export const isValidExpenseSubCategoryFilter = (value: number): value is TExpenseTypeFilter => {
    return value === OETypesOfExpense.ALL
        || value === OETypesOfExpense.REALEXPENSE
        || value === OETypesOfExpense.CARD
        || value === OETypesOfExpense.LOAN;
};

/** Helper function to remove null|undefined attributes from given expense type update options. */
export function filterNonNullableAttributes(options: UpdateExpenseCategoryPayload | UpdateExpenseSubCategoryPayload) {
    // Create a new object with only defined keys
    return Object.entries(options).reduce((acc, [ key, value ]) => {
        if(value !== undefined && value !== null) {
            acc[key] = value;
        }
        return acc;
    }, {} as any);
}
