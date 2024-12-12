import { CreateExpenseSubCategoryPayload } from "../../../../../../../common/types/expenses";
import { ValidCreation_DebitCardSimple } from "../../../../cards/payloads";

export const InvalidCreation_ExpenseSubCategory_IncorrectType = {
    categoryId: 1,
    name: "THIS MUST FAIL AND NOT BE SAVED",
    type: -1,
    instrumentId: 0
};

export const InvalidCreation_ExpenseSubCategory_ParentDoesNotExist = {
    categoryId: -1,
    name: "THIS MUST FAIL AND NOT BE SAVED",
    type: 1,
    instrumentId: 0
} as CreateExpenseSubCategoryPayload;

export const InvalidCreation_ExpenseSubCategory_Duplicated = {
    categoryId: 1,
    name: ValidCreation_DebitCardSimple.name,
    type: 1,
    instrumentId: 0
} as CreateExpenseSubCategoryPayload;
