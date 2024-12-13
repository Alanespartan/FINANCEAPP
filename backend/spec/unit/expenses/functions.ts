/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";

/** Utility function to validate an array of categories */
export function validateExpenseCategories(categories: any[]) {
    categories.forEach(validateExpenseCategory);
}

/** Utility function to validate a single expense category  */
export function validateExpenseCategory(category: any) {
    // Check required properties and types
    expect(category).to.be.an("object");
    expect(category).to.have.property("name").that.is.a("string");
    expect(category).to.have.property("id").that.is.a("number").and.is.greaterThan(0);
    expect(category).to.have.property("userId").that.is.a("number").and.is.greaterThan(0);
    expect(category).to.have.property("isDefault").that.is.a("boolean");

    // Validate subcategories array
    expect(category).to.have.property("subcategories").that.is.an("array");
    category.subcategories.forEach(validateExpenseSubcategory);
}

/** Utility function to validate an array of sub categories */
export function validateExpenseSubCategories(subcategories: any[]) {
    subcategories.forEach(validateExpenseSubcategory);
}

/** Utility function to validate a single expense sub category */
export function validateExpenseSubcategory(subcategory: any) {
    expect(subcategory).to.be.an("object");
    expect(subcategory).to.have.property("name").that.is.a("string");
    expect(subcategory).to.have.property("id").that.is.a("number").and.is.greaterThan(0);
    expect(subcategory).to.have.property("userId").that.is.a("number").and.is.greaterThan(0);

    // Validate 'type' attribute that has the TExpenseType form
    expect(subcategory).to.have.property("type").that.is.oneOf([ 1, 2, 3 ]);

    // Validate 'instrumentId' attribute if not undefined
    if(subcategory.instrumentId) {
        expect(subcategory.instrumentId).to.be.a("number");
    }
}
