/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";

/** Utility function to validate an array of loans have required properties and types */
export function validateLoans(loans: any[]) {
    loans.forEach(validateLoan);
}

/** Utility function to validate a single loan required properties and types */
export function validateLoan(loan: any) {
    // check is object
    expect(loan).to.be.an("object");

    // check basic properties
    expect(loan).to.have.property("name").that.is.a("string");
    expect(loan).to.have.property("id").that.is.a("number").and.is.greaterThan(0);
    expect(loan).to.have.property("userId").that.is.a("number").and.is.greaterThan(0);
    expect(loan).to.have.property("bankId").that.is.a("number").and.is.greaterThan(0);

    // check timestamp dates
    expect(loan).to.have.property("expires").that.is.a("number").and.is.greaterThan(0);
    expect(loan).to.have.property("createdOn").that.is.a("number").and.is.greaterThan(0);

    // check numeric values
    expect(loan).to.have.property("borrowed").that.is.a("number").and.is.greaterThan(0);
    expect(loan).to.have.property("fixedPaymentAmount").that.is.a("number").and.is.greaterThan(0);
    expect(loan).to.have.property("interestsToPay").that.is.a("number").and.is.greaterThan(0);
    expect(loan).to.have.property("annualInterestRate").that.is.a("number").and.is.greaterThan(0);
    expect(loan).to.have.property("totalPaid").that.is.a("number").and.is.greaterThanOrEqual(0);
    expect(loan).to.have.property("interestsPaid").that.is.a("number").and.is.greaterThanOrEqual(0);

    // check boolean values
    expect(loan).to.have.property("isFinished").that.is.a("boolean");
    expect(loan).to.have.property("archived").that.is.a("boolean");

    // Validate 'payFrequency' attribute that has the TPayFrequency enum form
    expect(loan).to.have.property("payFrequency").that.is.oneOf([ 0, 1, 2, 3 ]);
}
