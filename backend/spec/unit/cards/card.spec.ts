import { expect } from "chai";
import { ICard } from "../../../../common/types/cards";
import { agent, version } from "../../setup";
import * as payloads from "./payloads";

const cardPath = `/api/${version}/cards`;

describe(`Testing API: ${cardPath}`, function() {
    // #region Create Card Tests
    describe("When Creating a Card", function() {
        describe("Given a valid payload for debit card", function() {
            it("Then return '201 Created' and ICard object if required payload parameters are sent", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(payloads.ValidCreation_DebitCardSimple)
                    .expect(201)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("cardNumber", payloads.ValidCreation_DebitCardSimple.cardNumber);
                expect(returnedCard).to.have.property("name",       payloads.ValidCreation_DebitCardSimple.name);
                expect(returnedCard).to.have.property("balance",    payloads.ValidCreation_DebitCardSimple.balance);
                expect(returnedCard).to.have.property("type",       payloads.ValidCreation_DebitCardSimple.type);
                expect(returnedCard).to.have.property("bankId",     payloads.ValidCreation_DebitCardSimple.bankId);
                expect(returnedCard).to.have.property("archived",   false);
                expect(returnedCard).to.have.property("isVoucher",  false);
                expect(returnedCard).to.have.property("limit",      0);
            });
            it("Then return '201 Created' and ICard object if debit card is a voucher card", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(payloads.ValidCreation_DebitCardIsVoucher)
                    .expect(201)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("cardNumber", payloads.ValidCreation_DebitCardIsVoucher.cardNumber);
                expect(returnedCard).to.have.property("name",       payloads.ValidCreation_DebitCardIsVoucher.name);
                expect(returnedCard).to.have.property("balance",    payloads.ValidCreation_DebitCardIsVoucher.balance);
                expect(returnedCard).to.have.property("type",       payloads.ValidCreation_DebitCardIsVoucher.type);
                expect(returnedCard).to.have.property("bankId",     payloads.ValidCreation_DebitCardIsVoucher.bankId);
                expect(returnedCard).to.have.property("isVoucher",  true);
                expect(returnedCard).to.have.property("archived",   false);
                expect(returnedCard).to.have.property("limit",      0);
            });
            it("Then return '201 Created' and ICard object if no name was provided in payload", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(payloads.ValidCreation_DebitCardNoName)
                    .expect(201)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("name");
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("cardNumber", payloads.ValidCreation_DebitCardNoName.cardNumber);
                expect(returnedCard).to.have.property("balance",    payloads.ValidCreation_DebitCardNoName.balance);
                expect(returnedCard).to.have.property("type",       payloads.ValidCreation_DebitCardNoName.type);
                expect(returnedCard).to.have.property("bankId",     payloads.ValidCreation_DebitCardNoName.bankId);
                expect(returnedCard).to.have.property("archived",   false);
                expect(returnedCard).to.have.property("isVoucher",  false);
                expect(returnedCard).to.have.property("limit",      0);
            });
        });
        describe("Given a valid payload for credit card", function() {
            it("Then return '201 Created' and ICard object if required payload parameters are sent", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(payloads.ValidCreation_CreditCardSimple)
                    .expect(201)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("name",       payloads.ValidCreation_CreditCardSimple.name);
                expect(returnedCard).to.have.property("cardNumber", payloads.ValidCreation_CreditCardSimple.cardNumber);
                expect(returnedCard).to.have.property("bankId",     payloads.ValidCreation_CreditCardSimple.bankId);
                expect(returnedCard).to.have.property("balance",    payloads.ValidCreation_CreditCardSimple.balance);
                expect(returnedCard).to.have.property("type",       payloads.ValidCreation_CreditCardSimple.type);
                expect(returnedCard).to.have.property("limit",      payloads.ValidCreation_CreditCardSimple.limit);
                expect(returnedCard).to.have.property("archived",   false);
                expect(returnedCard).to.have.property("isVoucher",  false);
            });
            it("Then return '201 Created' and ICard object if no name was provided in payload", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(payloads.ValidCreation_CreditCardNoName)
                    .expect(201)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("name");
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("cardNumber", payloads.ValidCreation_CreditCardNoName.cardNumber);
                expect(returnedCard).to.have.property("bankId",     payloads.ValidCreation_CreditCardNoName.bankId);
                expect(returnedCard).to.have.property("balance",    payloads.ValidCreation_CreditCardNoName.balance);
                expect(returnedCard).to.have.property("type",       payloads.ValidCreation_CreditCardNoName.type);
                expect(returnedCard).to.have.property("limit",      payloads.ValidCreation_CreditCardNoName.limit);
                expect(returnedCard).to.have.property("archived",   false);
                expect(returnedCard).to.have.property("isVoucher",  false);
            });
        });
        describe("Given an invalid payload", function() {
            it("Then return '400 Bad Request Error' if a malformed payload is used", async function() {
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
                expect(res.body).to.have.property("info", "New card cannot be created because a malformed payload sent.");
            });
            it("Then return '400 Bad Request Error' if a card number contains non numeric chars", async function() {
                const res = await agent
                    .set("cardType", "1")
                    .post(cardPath)
                    .send(payloads.InvalidCreation_CardNumberIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.InvalidCreation_CardNumberIsIncorrect.cardNumber}" cannot be created because a card number can not contain non numeric chars.`);
            });
            it("Then return '400 Bad Request Error' if an invalid type is used", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(payloads.InvalidCreation_CardTypeIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.InvalidCreation_CardTypeIsIncorrect.cardNumber}" cannot be created because an incorrect type was used in the request: ${payloads.InvalidCreation_CardTypeIsIncorrect.type}.`);
            });
            it("Then return '400 Bad Request Error' if a non existing bank id is used", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(payloads.InvalidCreation_BankDoesNotExist)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.InvalidCreation_BankDoesNotExist.cardNumber}" cannot be created because an incorrect bank id was used in the request: ${payloads.InvalidCreation_BankDoesNotExist.bankId}.`);
            });
            it("Then return '400 Bad Request Error' if a card already exists with the given card number", async function() {
                const res = await agent
                    .set("cardType", "1")
                    .post(cardPath)
                    .send(payloads.InvalidCreation_DuplicatedCard)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.InvalidCreation_DuplicatedCard.cardNumber}" cannot be created because one with that name already exists.`);
            });
        });
        describe("Given an invalid payload for debit card", function() {
            it("Then return '400 Bad Request Error' if a limit was attempted to be set in a debit card", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(payloads.InvalidCreation_DebitCardHasLimit)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Debit card "${payloads.InvalidCreation_DebitCardHasLimit.cardNumber}" cannot be created because an incorrect card limit was used in the request: ${payloads.InvalidCreation_DebitCardHasLimit.type}.`);
            });
        });
        describe("Given an invalid payload for credit card", function() {
            it("Then return '400 Bad Request Error' if no limit was included", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(payloads.InvalidCreation_CreditCardNoLimit)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Credit card "${payloads.InvalidCreation_CreditCardNoLimit.cardNumber}" cannot be created because no limit value was given to create the card.`);
            });
            it("Then return '400 Bad Request Error' if an incorrect limit was used", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(payloads.InvalidCreation_CreditCardLimitIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Credit card "${payloads.InvalidCreation_CreditCardLimitIsIncorrect.cardNumber}" cannot be created because an incorrect card limit was used in the request: ${payloads.InvalidCreation_CreditCardLimitIsIncorrect.limit}.`);
            });
            it("Then return '400 Bad Request Error' if isVoucher was used", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(payloads.InvalidCreation_CreditCardIsVoucher)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Credit card "${payloads.InvalidCreation_CreditCardIsVoucher.cardNumber}" cannot be created because it can not be categorized as voucher card.`);
            });
        });
    });
    // #endregion Create Card Tests
    // #region Fetch Cards Tests
    describe("When Fetching Cards", function() {
        describe("Given no filter", function() {
            it("Then return '200 Success' and array of all previously created cards", async function() {
                const res = await agent
                    .get(cardPath)
                    .expect(200)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.lengthOf(5);
            });
        });
        describe("Given an invalid card type filter", function() {
            it("Then return '400 Bad Request Error' if card type is not in correct number format", async function() {
                const res = await agent
                    .get(cardPath)
                    .query({ cardType: [ true, false ] })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "Cards cannot be obtained because the card type filter provided was in an incorrect format.");
            });
            it("Then return '400 Bad Request Error' if card type filter is -1", async function() {
                const res = await agent
                    .get(cardPath)
                    .query({ cardType: -1 })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Cards cannot be obtained because an incorrect card type filter was used in the request: ${-1}.`);
            });
        });
        describe("Given a valid card type filter", function() {
            it("Then return '200 Success' and array of all previously created cards if cardType is 0", async function() {
                const res = await agent
                    .get(cardPath)
                    .query({ cardType: 0 })
                    .expect(200)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.lengthOf(5);
            });
            it("Then return '200 Success' and array of all previously created debit cards if cardType is 1", async function() {
                const res = await agent
                    .get(cardPath)
                    .query({ cardType: 1 })
                    .expect(200)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.lengthOf(3);
            });
            it("Then return '200 Success' and array of all previously created credit cards if cardType is 2", async function() {
                const res = await agent
                    .get(cardPath)
                    .query({ cardType: 2 })
                    .expect(200)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.lengthOf(2);
            });
            it("Then return '200 Success' and empty array if cardType is 3", async function() {
                const res = await agent
                    .get(cardPath)
                    .query({ cardType: 3 })
                    .expect(200)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.lengthOf(0);
            });
        });
    });
    // #endregion Fetch Cards Tests
    // #region Update Cards Tests
    describe("When Updating Cards", function() {
        describe("Given a valid payload for debit card", function() {
            it("Then return '200 Success' and ICard object if required payload parameters are sent", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidCreation_DebitCardNoName.cardNumber}`)
                    .send(payloads.ValidUpdate_DebitCardSimple)
                    .expect(200)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("balance",    payloads.ValidCreation_DebitCardNoName.balance);
                expect(returnedCard).to.have.property("bankId",     payloads.ValidCreation_DebitCardNoName.bankId);
                expect(returnedCard).to.have.property("type",       payloads.ValidCreation_DebitCardNoName.type);
                expect(returnedCard).to.have.property("cardNumber", payloads.ValidUpdate_DebitCardSimple.cardNumber);
                expect(returnedCard).to.have.property("name",       payloads.ValidUpdate_DebitCardSimple.name);
                expect(returnedCard).to.have.property("archived",   payloads.ValidUpdate_DebitCardSimple.archived);
                expect(returnedCard).to.have.property("expires",    payloads.ValidUpdate_DebitCardSimple.expires);
                expect(returnedCard).to.have.property("isVoucher",  false);
            });
            it("Then return '200 Success' and ICard object if debit card was updated to be a credit card", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidUpdate_DebitCardSimple.cardNumber}`)
                    .send(payloads.ValidUpdate_DebitCardIsNowCredit)
                    .expect(200)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("balance",    payloads.ValidCreation_DebitCardNoName.balance);
                expect(returnedCard).to.have.property("bankId",     payloads.ValidCreation_DebitCardNoName.bankId);
                expect(returnedCard).to.have.property("cardNumber", payloads.ValidUpdate_DebitCardSimple.cardNumber);
                expect(returnedCard).to.have.property("archived",   payloads.ValidUpdate_DebitCardSimple.archived);
                expect(returnedCard).to.have.property("expires",    payloads.ValidUpdate_DebitCardSimple.expires);
                expect(returnedCard).to.have.property("name",       payloads.ValidUpdate_DebitCardIsNowCredit.name);
                expect(returnedCard).to.have.property("type",       payloads.ValidUpdate_DebitCardIsNowCredit.type);
                expect(returnedCard).to.have.property("limit",      payloads.ValidUpdate_DebitCardIsNowCredit.limit);
                expect(returnedCard).to.have.property("isVoucher",  false);
            });
            it("Then return '200 Success' and ICard object if debit voucher card was updated to be a credit card", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidCreation_DebitCardIsVoucher.cardNumber}`)
                    .send(payloads.ValidUpdate_VoucherCardIsNowCredit)
                    .expect(200)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("balance",    payloads.ValidCreation_DebitCardIsVoucher.balance);
                expect(returnedCard).to.have.property("bankId",     payloads.ValidCreation_DebitCardIsVoucher.bankId);
                expect(returnedCard).to.have.property("cardNumber", payloads.ValidCreation_DebitCardIsVoucher.cardNumber);
                expect(returnedCard).to.have.property("name",       payloads.ValidUpdate_VoucherCardIsNowCredit.name);
                expect(returnedCard).to.have.property("type",       payloads.ValidUpdate_VoucherCardIsNowCredit.type);
                expect(returnedCard).to.have.property("limit",      payloads.ValidUpdate_VoucherCardIsNowCredit.limit);
                expect(returnedCard).to.have.property("archived",   false);
                expect(returnedCard).to.have.property("isVoucher",  false);
            });
        });
        describe("Given a valid payload for credit card", function() {
            it("Then return '200 Success' and ICard object if credit card was updated to be a debit card", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidCreation_CreditCardSimple.cardNumber}`)
                    .send(payloads.ValidUpdate_CreditCardIsNowDebit)
                    .expect(200)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("cardNumber", payloads.ValidCreation_CreditCardSimple.cardNumber);
                expect(returnedCard).to.have.property("balance",    payloads.ValidCreation_CreditCardSimple.balance);
                expect(returnedCard).to.have.property("bankId",     payloads.ValidCreation_CreditCardSimple.bankId);
                expect(returnedCard).to.have.property("expires",    payloads.ValidUpdate_CreditCardIsNowDebit.expires);
                expect(returnedCard).to.have.property("name",       payloads.ValidUpdate_CreditCardIsNowDebit.name);
                expect(returnedCard).to.have.property("type",       payloads.ValidUpdate_CreditCardIsNowDebit.type);
                expect(returnedCard).to.have.property("archived",   payloads.ValidUpdate_CreditCardIsNowDebit.archived);
                expect(returnedCard).to.have.property("limit",      0);
                expect(returnedCard).to.have.property("isVoucher",  false);
            });
        });
        describe("Given an invalid payload", function() {
            it("Then return '400 Bad Request Error' if card number contains non numeric chars", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.InvalidUpdate_CardNumberIsIncorrect}`)
                    .send(payloads.ValidUpdate_DebitCardSimple)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.InvalidUpdate_CardNumberIsIncorrect}" cannot be retrieved because a card number can not contain non numeric chars.`);
            });
            it("Then return '404 Not Found Error' if card number does no exist in user cards", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.InvalidUpdate_CardDoesNotExist}`)
                    .send(payloads.ValidUpdate_DebitCardSimple)
                    .expect(404)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The requested resource could not be found.");
                expect(res.body).to.have.property("info", `Card "${payloads.InvalidUpdate_CardDoesNotExist}" cannot be updated because it does not exist in user data.`);
            });
            it("Then return '400 Bad Request Error' if new card number contains non numeric chars", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidCreation_DebitCardSimple.cardNumber}`)
                    .send(payloads.InvalidUpdate_NewCardIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.ValidCreation_DebitCardSimple.cardNumber}" cannot be updated because the new card number "${payloads.InvalidUpdate_NewCardIsIncorrect.cardNumber}" can not contain non numeric chars.`);
            });
            it("Then return '400 Bad Request Error' if new card number already exists in user information", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidCreation_DebitCardSimple.cardNumber}`)
                    .send(payloads.InvalidUpdate_DuplicatedCard)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.ValidCreation_DebitCardSimple.cardNumber}" cannot be updated because one with the new card number "${payloads.InvalidUpdate_DuplicatedCard.cardNumber}" already exists.`);
            });
            it("Then return '400 Bad Request Error' if expiration date is incorrect", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidCreation_DebitCardSimple.cardNumber}`)
                    .send(payloads.InvalidUpdate_ExpirationDateIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.ValidCreation_DebitCardSimple.cardNumber}" cannot be updated because new expiration date "${payloads.InvalidUpdate_ExpirationDateIsIncorrect.expires}" can't be less than today's date.`);
            });
            it("Then return '400 Bad Request Error' if new card type is incorrect", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidCreation_CreditCardNoName.cardNumber}`)
                    .send(payloads.InvalidUpdate_CardTypeIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.ValidCreation_CreditCardNoName.cardNumber}" cannot be updated because an incorrect new card type was used in the request: ${payloads.InvalidUpdate_CardTypeIsIncorrect.type}.`);
            });
        });
        describe("Given an invalid payload for debit card", function() {
            it("Then return '400 Bad Request Error' if debit card is now credit card and has no limit", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidCreation_DebitCardSimple.cardNumber}`)
                    .send(payloads.InvalidUpdate_DebitIsNowCreditAndHasNoLimit)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.ValidCreation_DebitCardSimple.cardNumber}" cannot be updated to credit card because no limit value was given in the request.`);
            });
            it("Then return '400 Bad Request Error' if debit card is now credit card and limit is incorrect", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidCreation_DebitCardSimple.cardNumber}`)
                    .send(payloads.InvalidUpdate_DebitIsNowCreditAndLimitIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.ValidCreation_DebitCardSimple.cardNumber}" cannot be updated to credit card because an incorrect card limit was used in the request: ${payloads.InvalidUpdate_DebitIsNowCreditAndLimitIsIncorrect.limit}.`);
            });
            it("Then return '400 Bad Request Error' if debit card is now credit card and voucher state was sent", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidCreation_DebitCardSimple.cardNumber}`)
                    .send(payloads.InvalidUpdate_DebitIsNowCreditAndIsVoucher)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.ValidCreation_DebitCardSimple.cardNumber}" cannot be updated to credit card because it can not be categorized as voucher card.`);
            });
            it("Then return '400 Bad Request Error' if a limit was attempted to be set in a debit card", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidCreation_DebitCardSimple.cardNumber}`)
                    .send(payloads.InvalidUpdate_DebitCardHasLimit)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.ValidCreation_DebitCardSimple.cardNumber}" cannot be updated because a card limit (${payloads.InvalidUpdate_DebitCardHasLimit.limit}) was used in the request to update a non credit card.`);
            });
        });
        describe("Given an invalid payload for credit card", function() {
            it("Then return '400 Bad Request Error' if credit card is now debit card and has a limit", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidCreation_CreditCardNoName.cardNumber}`)
                    .send(payloads.InvalidUpdate_CreditIsNowDebitAndHasLimit)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.ValidCreation_CreditCardNoName.cardNumber}" cannot be updated to debit card because an incorrect card limit was used in the request: ${payloads.InvalidUpdate_CreditIsNowDebitAndHasLimit.limit}.`);
            });
            it("Then return '400 Bad Request Error' if an incorrect limit was used in a credit card", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidCreation_CreditCardNoName.cardNumber}`)
                    .send(payloads.InvalidUpdate_CreditCardLimitIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Credit card "${payloads.ValidCreation_CreditCardNoName.cardNumber}" cannot be updated because an incorrect card limit was used in the request: ${payloads.InvalidUpdate_CreditCardLimitIsIncorrect.limit}.`);
            });
            it("Then return '400 Bad Request Error' if voucher state was used to update a credit card", async function() {
                const res = await agent
                    .put(`${cardPath}/${payloads.ValidCreation_CreditCardNoName.cardNumber}`)
                    .send(payloads.InvalidUpdate_CreditCardIsVoucher)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Card "${payloads.ValidCreation_CreditCardNoName.cardNumber}" cannot be updated because it can not be categorized as voucher card.`);
            });
        });
    });
    // #endregion Update Cards Tests
});
