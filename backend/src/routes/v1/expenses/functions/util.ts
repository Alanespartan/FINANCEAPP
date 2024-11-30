import { OETypesOfExpense, TExpenseType, TExpenseTypeFilter } from "@common/types/expenses";

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
