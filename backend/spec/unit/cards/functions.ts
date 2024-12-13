/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";
import { CreateCardPayload, UpdateCardPayload } from "../../../../common/types/cards";

/** Utility function to validate an array of cards */
export function validateCards(cards: any[]) {
    cards.forEach((card) => validateCard(card));
}

/** Utility function to validate a card  */
export function validateCard(card: any, toMatch?: CreateCardPayload | UpdateCardPayload) {
    // check required ICard default properties and types
    expect(card).to.be.an("object");
    expect(card).to.have.property("id").that.is.a("number").and.is.greaterThan(0);
    expect(card).to.have.property("userId").that.is.a("number").and.is.greaterThan(0);
    expect(card).to.have.property("bankId").that.is.a("number").and.is.greaterThan(0);

    // validate properties if creation payload was given
    if(toMatch) {
        // toMatch is CreateCardPayload
        if(Object.entries(toMatch).map(([ key, ]) => key).includes("balance")) { // balance is always required in create payload
            // these are always required in CreateCardPayload
            expect(card).to.have.property("cardNumber", (toMatch as CreateCardPayload).cardNumber);
            expect(card).to.have.property("expires",    (toMatch as CreateCardPayload).expires);
            expect(card).to.have.property("type",       (toMatch as CreateCardPayload).type);
            expect(card).to.have.property("balance",    (toMatch as CreateCardPayload).balance);
            expect(card).to.have.property("archived", false); // every created card its default archived value is false
        }
        // toMatch is UpdateCardPayload
        else {
            if((toMatch as UpdateCardPayload).cardNumber) {
                expect(card).to.have.property("cardNumber", (toMatch as UpdateCardPayload).cardNumber);
            } else {
                expect(card).to.have.property("cardNumber").that.is.a("string");
            }

            if((toMatch as UpdateCardPayload).archived) {
                expect(card).to.have.property("archived", true); // if during update value is now true
            } else {
                expect(card).to.have.property("archived").that.is.a("boolean"); // default is false, but check only type, within spec file check for specific value from previous test
            }

            if((toMatch as UpdateCardPayload).expires) {
                expect(card).to.have.property("expires", (toMatch as UpdateCardPayload).expires);
            } else {
                expect(card).to.have.property("expires").that.is.a("number").and.is.greaterThan(0);
            }

            if((toMatch as UpdateCardPayload).type) {
                expect(card).to.have.property("type", (toMatch as UpdateCardPayload).type);
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
        if(toMatch.limit) {
            expect(card).to.have.property("limit", toMatch.limit);
        } else {
            expect(card).to.have.property("limit", 0); // default is 0
        }
        if(toMatch.isVoucher) {
            expect(card).to.have.property("isVoucher", true);
        } else {
            expect(card).to.have.property("isVoucher", false); // default is false
        }
    }
    // simply validate required properties and types
    else {
        expect(card).to.have.property("cardNumber").that.is.a("string");
        expect(card).to.have.property("name").that.is.a("string");
        expect(card).to.have.property("expires").that.is.a("number").and.is.greaterThan(0);
        expect(card).to.have.property("balance").that.is.a("number");
        expect(card).to.have.property("type").that.is.oneOf([ 1, 2, 3 ]); // TCardTypes values
        expect(card).to.have.property("archived").that.is.a("boolean");
        expect(card).to.have.property("limit").that.is.a("number").and.is.greaterThanOrEqual(0);
        expect(card).to.have.property("isVoucher").that.is.a("boolean");
    }
}

