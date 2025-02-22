import { expenseCategoryStore, expenseSubCategoryStore } from "@db";
import { ExpenseCategory, ExpenseSubCategory } from "@entities";

/**
* Saves a given entity in the database expense catgory store. If entity does exist in the database it's updated, otherwise it's inserted.
* @param {ExpenseCategory} toSave Expense category object used to overwrite existing entry or create a new one
* @returns {Promise<ExpenseCategory>} A promise containing the saved expense category entity instance with the id generated by the database
*/
export async function saveExpenseCategory(toSave: ExpenseCategory): Promise<ExpenseCategory> {
    return await expenseCategoryStore.save(toSave);
}

/**
* Saves a given entity in the database expense sub catgory store. If entity does exist in the database it's updated, otherwise it's inserted.
* @param {ExpenseCategory} toSave Expense sub category object used to overwrite existing entry or create a new one
* @returns {Promise<ExpenseSubCategory>} A promise containing the saved expense sub category entity instance with the id generated by the database
*/
export async function saveExpenseSubCategory(toSave: ExpenseSubCategory): Promise<ExpenseSubCategory> {
    return await expenseSubCategoryStore.save(toSave);
}
