import { CreateExpenseSubCategoryPayload } from "../../../../../../../common/types/expenses";

export const ValidCreation_ExpenseSubCategory_SimpleTest = {
    categoryId: 3,
    name: "Video Games",
    type: 1
} as CreateExpenseSubCategoryPayload;

export const ValidCreation_ExpenseSubCategory_MultipleDummy: CreateExpenseSubCategoryPayload[] = [
    {
        categoryId: 4,
        name: "GYM Supplements",
        type: 1
    },
    {
        categoryId: 5,
        name: "Uber Eats Order",
        type: 1
    },
    {
        categoryId: 6,
        name: "Medicine",
        type: 1
    },
];
