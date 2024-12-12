import { CreateExpenseCategoryPayload } from "../../../../../../../common/types/expenses";

export const ValidCreation_ExpenseCategorySimple = {
    name: "Create Expense Category Simple Test",
    isDefault: false
} as CreateExpenseCategoryPayload;

export const ValidCreation_DummyExpenseCategories: CreateExpenseCategoryPayload[] = [
    {
        name: "Dummy Expense Category 1",
        isDefault: false
    },
    {
        name: "Dummy Expense Category 2",
        isDefault: false
    },
    {
        name: "Dummy Expense Category 3",
        isDefault: false
    },
];
