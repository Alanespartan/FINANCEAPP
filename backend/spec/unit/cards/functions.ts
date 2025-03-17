/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";
import { CreateCardPayload, UpdateCardPayload } from "../../../../common/types/cards";

/** Utility function to validate an array of cards */
export function validateCards(cards: any[]) {
    cards.forEach((card) => validateCard(card));
}

function payloadIsForCreation(payload: any): payload is CreateCardPayload{
    // balance is always required in create payload
    return Object.entries(payload).map(([ key, ]) => key).includes("balance");
}

/** Utility function to validate a card  */
export function validateCard(card: any, toMatch?: CreateCardPayload | UpdateCardPayload) {
    // check required ICard default properties and types
    expect(card).to.be.an("object");
    expect(card).to.have.property("id").that.is.a("number").and.is.greaterThan(0);
    expect(card).to.have.property("userId").that.is.a("number").and.is.greaterThan(0);
    expect(card).to.have.property("bankId").that.is.a("number").and.is.greaterThan(0);

    // validate properties if a payload was given
    if(toMatch) {
        // toMatch is CreateCardPayload
        if(payloadIsForCreation(toMatch)) {
            // these are always required in CreateCardPayload
            expect(card).to.have.property("cardNumber",  toMatch.cardNumber);
            expect(card).to.have.property("expires",     toMatch.expires);
            expect(card).to.have.property("type",        toMatch.type);
            expect(card).to.have.property("balance",     toMatch.balance);
            expect(card).to.have.property("limit",       toMatch.limit ?? 0); // default value is 0 unless provided when creating a credit card
            expect(card).to.have.property("cutOffDate",  toMatch.paymentDate ?? 1); // default value is 1 unless provided when creating a credit card
            expect(card).to.have.property("paymentDate", toMatch.cutOffDate ?? 1); // default value is 1 unless provided when creating a credit card
            expect(card).to.have.property("isVoucher",   toMatch.isVoucher ?? false); // default value is false unless provided when creating a card
            expect(card).to.have.property("archived",    false); // default value is false since a new card cant be archived
        }
        // toMatch is UpdateCardPayload
        else {
            if(toMatch.cardNumber) {
                expect(card).to.have.property("cardNumber", toMatch.cardNumber);
            } else {
                expect(card).to.have.property("cardNumber").that.is.a("string");
            }

            if(toMatch.archived) {
                expect(card).to.have.property("archived", true); // if during update value is now true
            } else {
                expect(card).to.have.property("archived").that.is.a("boolean"); // default is false, but check only type, within spec file check for specific value from previous test
            }

            if(toMatch.expires) {
                expect(card).to.have.property("expires", toMatch.expires);
            } else {
                expect(card).to.have.property("expires").that.is.a("number").and.is.greaterThan(0);
            }

            if(toMatch.cutOffDate) {
                expect(card).to.have.property("cutOffDate", toMatch.cutOffDate);
            } else {
                expect(card).to.have.property("cutOffDate").that.is.a("number").and.is.greaterThanOrEqual(1);
            }

            if(toMatch.paymentDate) {
                expect(card).to.have.property("paymentDate", toMatch.paymentDate);
            } else {
                expect(card).to.have.property("paymentDate").that.is.a("number").and.is.greaterThanOrEqual(1);
            }

            if(toMatch.type) {
                expect(card).to.have.property("type", toMatch.type);
            } else {
                expect(card).to.have.property("type").that.is.oneOf([ 1, 2, 3 ]); // TCardTypes values
            }

            expect(card).to.have.property("balance").that.is.a("number").and.is.greaterThan(0); // cant update balance but returned value must be greater than 0
        }

        // these are optional in CreateCardPayload and UpdateCardPayload
        if(toMatch.name) {
            expect(card).to.have.property("name", toMatch.name);
        } else {
            expect(card).to.have.property("name").that.is.a("string");
        }
    }
    // otherwise simply validate required properties and types
    else {
        expect(card).to.have.property("cardNumber").that.is.a("string");
        expect(card).to.have.property("name").that.is.a("string");
        expect(card).to.have.property("expires").that.is.a("number").and.is.greaterThan(0); // utc timestampz
        expect(card).to.have.property("cutOffDate").that.is.a("number").and.is.greaterThanOrEqual(1); // day of the month
        expect(card).to.have.property("paymentDate").that.is.a("number").and.is.greaterThanOrEqual(1); // day of the month
        expect(card).to.have.property("balance").that.is.a("number"); // how much money the card has
        expect(card).to.have.property("type").that.is.oneOf([ 1, 2, 3 ]); // TCardTypes values
        expect(card).to.have.property("archived").that.is.a("boolean");
        expect(card).to.have.property("limit").that.is.a("number").and.is.greaterThanOrEqual(0); // if debit then 0 otherwise it has a limit
        expect(card).to.have.property("isVoucher").that.is.a("boolean");
    }
}

