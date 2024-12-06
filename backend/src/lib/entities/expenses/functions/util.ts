/* eslint-disable @typescript-eslint/no-explicit-any */
import { OETypesOfExpense, TExpenseType, TExpenseTypeFilter, UpdateExpenseTypePayload } from "@common/types/expenses";

export const isValidExpenseType = (value: number): value is TExpenseType => {
    return value === OETypesOfExpense.REALEXPENSE
        || value === OETypesOfExpense.CARD
        || value === OETypesOfExpense.LOAN
        || value === OETypesOfExpense.SAVINGS;
};

export const isValidExpenseTypeFilter = (value: number): value is TExpenseTypeFilter => {
    return value === OETypesOfExpense.ALL
        || value === OETypesOfExpense.REALEXPENSE
        || value === OETypesOfExpense.CARD
        || value === OETypesOfExpense.LOAN
        || value === OETypesOfExpense.SAVINGS;
};

/** Helper function to remove null|undefined attributes from given expense type update options. */
export function filterNonNullableAttributes(options: UpdateExpenseTypePayload) {
    // Create a new object with only defined keys
    return Object.entries(options).reduce((acc, [ key, value ]) => {
        if(value !== undefined && value !== null) {
            acc[key as keyof UpdateExpenseTypePayload] = value;
        }
        return acc;
    }, {} as any);
}
