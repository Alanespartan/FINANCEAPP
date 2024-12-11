/* eslint-disable @typescript-eslint/no-explicit-any */
import { OETypesOfExpense, TExpenseType, TExpenseTypeFilter,
    UpdateExpenseCategoryPayload, UpdateExpenseSubCategoryPayload,
    CreateExpenseCategoryPayload
} from "@common/types/expenses";

/**
 * Ensures create expense category body is in correct format and all required information is present.
 * @param {unknown} body Body from create expense category request.
 * @returns bodyisCreateExpenseCategoryPayload wheter or not the body is valid
 */
export function verifyCreateExpenseCategoryBody(body: unknown): body is CreateExpenseCategoryPayload {
    if(typeof body !== "object") return false;
    if(!body) return false;
    const parsed = body as CreateExpenseCategoryPayload;

    return typeof parsed.name === "string"; // && typeof parsed.isDefault === "boolean";
}

/**
 * Ensures body is in correct format and all required information is present to update an expense category.
 * @param {unknown} body Body from update expense category request.
 * @returns bodyisUpdateExpenseCategoryPayload wheter or not the body is valid
 */
export function verifyUpdateExpenseCategoryBody(body: unknown): body is UpdateExpenseCategoryPayload {
    if(typeof body !== "object") { return false; } // if body is not an object
    if(!body) { return false; } // null or undefined
    if(Object.entries(body).length === 0) { return false; } // if empty object {}
    const parsed = body as UpdateExpenseCategoryPayload;
    let count = 0;
    if(parsed.name) { count++; if(typeof parsed.name !== "string")       { return false; } }
    if(count === 0) { return false; } // if obj has keys but none is from update expense category payload interface
    return true;
}

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

/** Helper function to remove null|undefined attributes from given expense category/subcategory update options. */
export function filterNonNullableAttributes(options: UpdateExpenseCategoryPayload | UpdateExpenseSubCategoryPayload) {
    // Create a new object with only defined keys
    return Object.entries(options).reduce((acc, [ key, value ]) => {
        if(value !== undefined && value !== null) {
            acc[key] = value;
        }
        return acc;
    }, {} as any);
}
