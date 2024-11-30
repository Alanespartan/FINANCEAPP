import { ETypesOfExpense, TAvailableExpenseTypes } from "@common/types/expenses";

export const isValidExpenseType = (value: number): value is TAvailableExpenseTypes => {
    return value === ETypesOfExpense.REALEXPENSE
        || value === ETypesOfExpense.CARD
        || value === ETypesOfExpense.LOAN
        || value === ETypesOfExpense.SAVINGS;
};
