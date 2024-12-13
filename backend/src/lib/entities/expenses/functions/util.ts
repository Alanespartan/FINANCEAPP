/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    OETypesOfExpense, TExpenseType, TExpenseTypeFilter,
    CreateExpenseCategoryPayload, CreateExpenseSubCategoryPayload,
    UpdateExpenseCategoryPayload, UpdateExpenseSubCategoryPayload
} from "@common/types/expenses";

/**
 * Ensures create expense category body is in correct format and all required information is present.
 * @param {unknown} body Body from create expense category request.
 * @returns bodyisCreateExpenseCategoryPayload wheter or not the body is valid
 */
export function verifyCreateExpenseCategoryBody(body: unknown): body is CreateExpenseCategoryPayload {
    if(typeof body !== "object") { return false; } // if body is not an object
    if(!body) { return false; } // null or undefined
    if(Object.entries(body).length === 0) { return false; } // if empty object {}
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

/**
 * Ensures create expense sub category body is in correct format and all required information is present.
 * @param {unknown} body Body from create expense sub category request.
 * @returns bodyisCreateExpenseSubCategoryPayload wheter or not the body is valid
 */
export function verifyCreateExpenseSubCategoryBody(body: unknown): body is CreateExpenseSubCategoryPayload {
    if(typeof body !== "object") { return false; } // if body is not an object
    if(!body) { return false; } // null or undefined
    if(Object.entries(body).length === 0) { return false; } // if empty object {}
    const parsed = body as CreateExpenseSubCategoryPayload;

    const validInstrumentId = parsed.instrumentId ? typeof parsed.instrumentId === "number" ? true : false : true;

    return typeof parsed.name       === "string" &&
           typeof parsed.categoryId === "number" &&
           typeof parsed.type       === "number" &&
           validInstrumentId;
}

/**
 * Ensures body is in correct format and all required information is present to update an expense sub category.
 * @param {unknown} body Body from update expense sub category request.
 * @returns bodyisUpdateExpenseSubCategoryPayload wheter or not the body is valid
 */
export function verifyUpdateExpenseSubCategoryBody(body: unknown): body is UpdateExpenseSubCategoryPayload {
    if(typeof body !== "object") { return false; } // if body is not an object
    if(!body) { return false; } // null or undefined
    if(Object.entries(body).length === 0) { return false; } // if empty object {}
    const parsed = body as UpdateExpenseSubCategoryPayload;
    let count = 0;
    if(parsed.name) { count++; if(typeof parsed.name !== "string")       { return false; } }
    if(count === 0) { return false; } // if obj has keys but none is from update expense sub category payload interface
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
