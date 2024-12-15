/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";
import { CreateLoanPayload, UpdateLoanPayload } from "../../../../common/types/loans";

/** Utility function to validate an array of loans have required properties and types */
export function validateLoans(loans: any[]) {
    loans.forEach((loan) => validateLoan(loan));
}

/** Utility function to validate a single loan required properties and types */
export function validateLoan(loan: any, toMatch?: CreateLoanPayload | UpdateLoanPayload) {
    // check required ILoan basic properties and types
    expect(loan).to.be.an("object");
    expect(loan).to.have.property("id").that.is.a("number").and.is.greaterThan(0);
    expect(loan).to.have.property("userId").that.is.a("number").and.is.greaterThan(0);
    expect(loan).to.have.property("bankId").that.is.a("number").and.is.greaterThan(0);

    // validate properties if creation payload was given
    if(toMatch) {
        // toMatch is CreateLoanPayload
        if(Object.entries(toMatch).map(([ key, ]) => key).includes("bankId")) { // bankId is always required in create payload
            // these are always required in CreateLoanPayload
            expect(loan).to.have.property("name",         (toMatch as CreateLoanPayload).name);
            expect(loan).to.have.property("expires",      (toMatch as CreateLoanPayload).expires);
            expect(loan).to.have.property("payFrequency", (toMatch as CreateLoanPayload).payFrequency);
            expect(loan).to.have.property("borrowed",     (toMatch as CreateLoanPayload).borrowed);
            expect(loan).to.have.property("fixedPaymentAmount", (toMatch as CreateLoanPayload).fixedPaymentAmount);
            expect(loan).to.have.property("interestsToPay",     (toMatch as CreateLoanPayload).interestsToPay);
            expect(loan).to.have.property("annualInterestRate", (toMatch as CreateLoanPayload).annualInterestRate);
            expect(loan).to.have.property("bankId",             (toMatch as CreateLoanPayload).bankId);

            // every created loan has the following default values
            expect(loan).to.have.property("archived", false);   // 'archived'      value is false
            expect(loan).to.have.property("isFinished", false); // 'isFinished'    value is false
            expect(loan).to.have.property("totalPaid", 0);      // 'totalPaid'     value is 0
            expect(loan).to.have.property("interestsPaid", 0);  // 'interestsPaid' value is 0
            expect(loan).to.have.property("createdOn").that.is.a("number").and.is.greaterThan(0); //timestampt utc
        }
        // toMatch is UpdateLoanPayload
        else {
            if((toMatch as UpdateLoanPayload).name) {
                expect(loan).to.have.property("name", (toMatch as UpdateLoanPayload).name);
            } else {
                expect(loan).to.have.property("name").that.is.a("string");
            }
            if((toMatch as UpdateLoanPayload).expires) {
                expect(loan).to.have.property("expires", (toMatch as UpdateLoanPayload).expires);
            } else {
                expect(loan).to.have.property("expires").that.is.a("number").and.is.greaterThan(0);
            }
            if((toMatch as UpdateLoanPayload).borrowed) {
                expect(loan).to.have.property("borrowed", (toMatch as UpdateLoanPayload).borrowed);
            } else {
                expect(loan).to.have.property("borrowed").that.is.a("number").and.is.greaterThan(0);
            }
            if((toMatch as UpdateLoanPayload).fixedPaymentAmount) {
                expect(loan).to.have.property("fixedPaymentAmount", (toMatch as UpdateLoanPayload).fixedPaymentAmount);
            } else {
                expect(loan).to.have.property("fixedPaymentAmount").that.is.a("number").and.is.greaterThan(0).and.is.lessThan(loan.borrowed);
            }
            if((toMatch as UpdateLoanPayload).interestsToPay) {
                expect(loan).to.have.property("interestsToPay", (toMatch as UpdateLoanPayload).interestsToPay);
            } else {
                expect(loan).to.have.property("interestsToPay").that.is.a("number").and.is.greaterThan(0).and.is.lessThan(loan.borrowed);
            }
            if((toMatch as UpdateLoanPayload).annualInterestRate) {
                expect(loan).to.have.property("annualInterestRate", (toMatch as UpdateLoanPayload).annualInterestRate);
            } else {
                expect(loan).to.have.property("annualInterestRate").that.is.a("number").and.is.greaterThan(0).and.is.lessThan(loan.borrowed);
            }
            if((toMatch as UpdateLoanPayload).isFinished) {
                expect(loan).to.have.property("isFinished", true); // if during update value is now true
            } else {
                expect(loan).to.have.property("isFinished").that.is.a("boolean"); // default is false, but check only type, within spec file check for specific value from previous test
            }
            if((toMatch as UpdateLoanPayload).archived) {
                expect(loan).to.have.property("archived", true); // if during update value is now true
            } else {
                expect(loan).to.have.property("archived").that.is.a("boolean"); // default is false, but check only type, within spec file check for specific value from previous test
            }
            if((toMatch as UpdateLoanPayload).payFrequency) {
                expect(loan).to.have.property("payFrequency", (toMatch as UpdateLoanPayload).payFrequency);
            } else {
                expect(loan).to.have.property("payFrequency").that.is.oneOf([ 0, 1, 2, 3 ]); // TPayFrequency enum
            }

            // these values are not present in update payload but validate their returned value is correct
            expect(loan).to.have.property("createdOn").that.is.a("number").and.is.greaterThan(0); //timestampt utc
            expect(loan).to.have.property("totalPaid").that.is.a("number").and.is.greaterThanOrEqual(0);
            expect(loan).to.have.property("interestsPaid").that.is.a("number").and.is.greaterThanOrEqual(0);
        }
    }
    // simply validate required properties and types
    else {
        // check string values
        expect(loan).to.have.property("name").that.is.a("string");
        // check timestamp dates
        expect(loan).to.have.property("expires").that.is.a("number").and.is.greaterThan(0); //timestampt utc
        expect(loan).to.have.property("createdOn").that.is.a("number").and.is.greaterThan(0); //timestampt utc
        // check numeric values
        expect(loan).to.have.property("payFrequency").that.is.oneOf([ 0, 1, 2, 3 ]); // TPayFrequency enum
        expect(loan).to.have.property("borrowed").that.is.a("number").and.is.greaterThan(0);
        expect(loan).to.have.property("fixedPaymentAmount").that.is.a("number").and.is.greaterThan(0).and.is.lessThan(loan.borrowed);
        expect(loan).to.have.property("interestsToPay").that.is.a("number").and.is.greaterThan(0).and.is.lessThan(loan.borrowed);
        expect(loan).to.have.property("annualInterestRate").that.is.a("number").and.is.greaterThan(0).and.is.lessThan(loan.borrowed);
        expect(loan).to.have.property("totalPaid").that.is.a("number").and.is.greaterThanOrEqual(0);
        expect(loan).to.have.property("interestsPaid").that.is.a("number").and.is.greaterThanOrEqual(0);
        // check boolean values
        expect(loan).to.have.property("archived").that.is.a("boolean");
        expect(loan).to.have.property("isFinished").that.is.a("boolean");
    }
}
