import { expect } from "chai";
import { ICard, CreateCardPayload } from "../../../../common/types/cards";
import { agent, version } from "../../setup";

const cardPath = `/api/${version}/cards`;

describe(`Testing API: ${cardPath}`, function() {
    // #region Create Card Tests
    describe("When Creating a Card", function() {
        describe("Given valid payload for debit card", function() {
            const debitCardSimple = {
                cardNumber: "4815697378921530",
                expires:    new Date(),
                type:       1,
                bankId:     1,
                balance:    10000,

                name:       "Debit Card Simple Test",
            } as CreateCardPayload;
            const debitCardVoucher = {
                cardNumber: "4815697378921531",
                expires:    new Date(),
                type:       1,
                bankId:     1,
                balance:    20000,

                name:       "Debit Card Voucher Test",
                isVoucher:  true
            } as CreateCardPayload;
            const debitCardNoName = {
                cardNumber: "4815697378921532",
                expires:    new Date(),
                type:       1,
                bankId:     1,
                balance:    30000
            } as CreateCardPayload;
            it("Must return a 201 Created and return ICard object if required payload parameters are sent", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(debitCardSimple)
                    .expect(201)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("cardNumber", debitCardSimple.cardNumber);
                expect(returnedCard).to.have.property("name", debitCardSimple.name);
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("balance", debitCardSimple.balance);
                expect(returnedCard).to.have.property("type", debitCardSimple.type);
                expect(returnedCard).to.have.property("archived", false);
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("bankId", debitCardSimple.bankId);
            });
            it("Must return a 201 Created and return ICard object if debit card is a voucher card", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(debitCardVoucher)
                    .expect(201)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("cardNumber", debitCardVoucher.cardNumber);
                expect(returnedCard).to.have.property("name", debitCardVoucher.name);
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("balance", debitCardVoucher.balance);
                expect(returnedCard).to.have.property("type", debitCardVoucher.type);
                expect(returnedCard).to.have.property("archived", false);
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("bankId", debitCardVoucher.bankId);
                expect(returnedCard).to.have.property("isVoucher", true);
            });
            it("Must return a 201 Created and return ICard object if no name was provided in payload", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(debitCardNoName)
                    .expect(201)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("cardNumber", debitCardNoName.cardNumber);
                expect(returnedCard).to.have.property("name");
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("balance", debitCardNoName.balance);
                expect(returnedCard).to.have.property("type", debitCardNoName.type);
                expect(returnedCard).to.have.property("archived", false);
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("bankId", debitCardNoName.bankId);
            });
        });
        describe("Given invalid payload", function() {
            const invalidCardType = {
                cardNumber: "4915697378921530",
                expires:    new Date(),
                type:       -1,
                bankId:     1,
                balance:    10000
            };
            const invalidCardNumber = {
                cardNumber: "4915a6973b7892c1530d",
                expires:    new Date(),
                type:       1,
                bankId:     1,
                balance:    10000
            } as CreateCardPayload;
            const duplicatedCard = {
                cardNumber: "4815697378921530",
                expires:    new Date(),
                type:       1,
                bankId:     1,
                balance:    10000
            } as CreateCardPayload;
            const invalidBank = {
                cardNumber: "4915697378921531",
                expires:    new Date(),
                type:       1,
                bankId:     -1,
                balance:    10000
            } as CreateCardPayload;
            it("Must throw a 400 Bad Request Error if a malformed payload is used", async function() {
                const res = await agent
                    .post(cardPath)
                    .send({
                        incorrectProp1: "",
                        nonExistingProp: 2
                    })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "Malformed payload sent.");
            });
            it("Must throw a 400 Bad Request Error if an invalid type is used", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(invalidCardType)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "Invalid type for creating a new card.");
            });
            it("Must throw a 400 Bad Request Error if a card number contains non numeric chars", async function() {
                const res = await agent
                    .set("cardType", "1")
                    .post(cardPath)
                    .send(invalidCardNumber)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Invalid card number "${invalidCardNumber.cardNumber}". A card number can not contain non numeric chars.`);
            });
            it("Must throw a 400 Bad Request Error if a card already exists with the given card number", async function() {
                const res = await agent
                    .set("cardType", "1")
                    .post(cardPath)
                    .send(duplicatedCard)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `A card with the "${duplicatedCard.cardNumber}" number already exists.`);
            });
        });
        /*
        describe("Given invalid payload for a debit card", function() {
            const debitCardHasLimit = {
                cardNumber: "4915697378921532",
                expires:    new Date(),
                type:       1,
                bankId:     1,
                balance:    10000,

                limit:      20000
            } as CreateCardPayload;
        });*/
    });
    // #endregion Create Card Tests

    // #region Fetch Card Tests
    // #endregion Fetch Card Tests
});
