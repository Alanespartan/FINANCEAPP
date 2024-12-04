import { expect } from "chai";
import { ICard, CreateCardPayload, UpdateCardPayload } from "../../../../common/types/cards";
import { agent, version } from "../../setup";

const cardPath = `/api/${version}/cards`;

// #region Payloads
// VALID
// // CREATE DEBIT
const ValidCreation_DebitCardSimple = {
    cardNumber: "4815697378921530",
    expires:    new Date(),
    type:       1,
    bankId:     1,
    balance:    10000,

    name:       "Debit Card Simple Test",
} as CreateCardPayload;
const ValidCreation_DebitCardIsVoucher = {
    cardNumber: "4815697378921531",
    expires:    new Date(),
    type:       1,
    bankId:     1,
    balance:    20000,

    name:       "Debit Card Voucher Test",
    isVoucher:  true
} as CreateCardPayload;
const ValidCreation_DebitCardNoName = {
    cardNumber: "4815697378921532",
    expires:    new Date(),
    type:       1,
    bankId:     1,
    balance:    30000
} as CreateCardPayload;
// // CREATE CREDIT
const ValidCreation_CreditCardSimple = {
    cardNumber: "5815697378921530",
    expires:    new Date(),
    type:       2,
    bankId:     1,
    balance:    10000,

    name:       "Credit Card Simple Test",
    limit:      20000
} as CreateCardPayload;
const ValidCreation_CreditCardNoName = {
    cardNumber: "5815697378921531",
    expires:    new Date(),
    type:       2,
    bankId:     1,
    balance:    30000,

    limit:      50000
} as CreateCardPayload;
// // UPDATE DEBIT
const ValidUpdate_DebitCardSimple = {
    cardNumber: "4815923786975123",
    archived:   true,
    expires:    new Date().getTime() + 100000000,
    name:       "Debit Card Simple Update Test"
} as UpdateCardPayload;
const ValidUpdate_DebitCardIsNowCredit = {
    type:  2,
    limit: 40000,
    name:  "Debit Card Is Now Credit Card Test"
} as UpdateCardPayload;
const ValidUpdate_VoucherCardIsNowCredit = {
    type:  2,
    limit: 35000,
    name:  "Voucher Card Is Now Credit Card Test"
} as UpdateCardPayload;
// UPDATE CREDIT
const ValidUpdate_CreditCardIsNowDebit = {
    type:     1,
    archived: true,
    name:     "Credit Card Is Now Debit Card Test",
    expires:  new Date().getTime() + 150000000,
} as UpdateCardPayload;

// INVALID
// // CREATE GENERAL
const InvalidCreation_CardTypeIsIncorrect = {
    cardNumber: "4915697378921530",
    expires:    new Date(),
    type:       -1,
    bankId:     1,
    balance:    10000
};
const InvalidCreation_CardNumberIsIncorrect = {
    cardNumber: "4915a6973b7892c1530d",
    expires:    new Date(),
    type:       1,
    bankId:     1,
    balance:    10000
} as CreateCardPayload;
const InvalidCreation_DuplicatedCard = {
    cardNumber: "4815697378921530",
    expires:    new Date(),
    type:       1,
    bankId:     1,
    balance:    10000
} as CreateCardPayload;
const InvalidCreation_BankDoesNotExist = {
    cardNumber: "4915697378921530",
    expires:    new Date(),
    type:       1,
    bankId:     -1,
    balance:    10000
} as CreateCardPayload;
// // CREATE DEBIT
const InvalidCreation_DebitCardHasLimit = {
    cardNumber: "4915697378921530",
    expires:    new Date(),
    type:       1,
    bankId:     1,
    balance:    10000,

    limit:      20000
} as CreateCardPayload;
// // CREATE CREDIT
const InvalidCreation_CreditCardNoLimit = {
    cardNumber: "5915697378921530",
    expires:    new Date(),
    type:       2,
    bankId:     1,
    balance:    10000,
} as CreateCardPayload;
const InvalidCreation_CreditCardLimitIsIncorrect = {
    cardNumber: "5915697378921530",
    expires:    new Date(),
    type:       2,
    bankId:     1,
    balance:    10000,

    limit:      -1
} as CreateCardPayload;
const InvalidCreation_CreditCardIsVoucher = {
    cardNumber: "5915697378921530",
    expires:    new Date(),
    type:       2,
    bankId:     1,
    balance:    30000,

    limit:      50000,
    isVoucher:  true
} as CreateCardPayload;
// // UPDATE GENERAL
const InvalidUpdate_CardNumberIsIncorrect = "4815a6973b7892c1532d";
const InvalidUpdate_CardDoesNotExist = "9815692153273789";
const InvalidUpdate_DuplicatedCard = {
    cardNumber: ValidCreation_CreditCardSimple.cardNumber
} as UpdateCardPayload;
const InvalidUpdate_NewCardIsIncorrect = {
    cardNumber: InvalidUpdate_CardNumberIsIncorrect
} as UpdateCardPayload;
const InvalidUpdate_ExpirationDateIsIncorrect = {
    expires: new Date().getTime() - 100000000,
} as UpdateCardPayload;
const InvalidUpdate_CardTypeIsIncorrect = {
    type: -1
};
// UPDATE DEBIT
const InvalidUpdate_DebitCardHasLimit = {
    limit: 10000
} as UpdateCardPayload;
const InvalidUpdate_DebitIsNowCreditAndHasNoLimit = {
    type: 2
} as UpdateCardPayload;
const InvalidUpdate_DebitIsNowCreditAndLimitIsIncorrect = {
    type: 2,
    limit: -1
} as UpdateCardPayload;
// UPDATE CREDIT
const InvalidUpdate_CreditCardLimitIsIncorrect = {
    limit: -1
} as UpdateCardPayload;
const InvalidUpdate_CreditIsNowDebitAndHasLimit = {
    type: 1,
    limit: 10000
} as UpdateCardPayload;
const InvalidUpdate_CreditCardIsVoucher = {
    isVoucher: true
} as UpdateCardPayload;

// #endregion Payloads

describe(`Testing API: ${cardPath}`, function() {
    // #region Create Card Tests
    describe("When Creating a Card", function() {
        describe("Given a valid payload for debit card", function() {
            it("Then return '201 Created' and ICard object if required payload parameters are sent", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(ValidCreation_DebitCardSimple)
                    .expect(201)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("cardNumber", ValidCreation_DebitCardSimple.cardNumber);
                expect(returnedCard).to.have.property("name",       ValidCreation_DebitCardSimple.name);
                expect(returnedCard).to.have.property("balance",    ValidCreation_DebitCardSimple.balance);
                expect(returnedCard).to.have.property("type",       ValidCreation_DebitCardSimple.type);
                expect(returnedCard).to.have.property("bankId",     ValidCreation_DebitCardSimple.bankId);
                expect(returnedCard).to.have.property("archived",   false);
                expect(returnedCard).to.have.property("isVoucher",  false);
                expect(returnedCard).to.have.property("limit",      0);
            });
            it("Then return '201 Created' and ICard object if debit card is a voucher card", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(ValidCreation_DebitCardIsVoucher)
                    .expect(201)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("cardNumber", ValidCreation_DebitCardIsVoucher.cardNumber);
                expect(returnedCard).to.have.property("name",       ValidCreation_DebitCardIsVoucher.name);
                expect(returnedCard).to.have.property("balance",    ValidCreation_DebitCardIsVoucher.balance);
                expect(returnedCard).to.have.property("type",       ValidCreation_DebitCardIsVoucher.type);
                expect(returnedCard).to.have.property("bankId",     ValidCreation_DebitCardIsVoucher.bankId);
                expect(returnedCard).to.have.property("isVoucher",  true);
                expect(returnedCard).to.have.property("archived",   false);
                expect(returnedCard).to.have.property("limit",      0);
            });
            it("Then return '201 Created' and ICard object if no name was provided in payload", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(ValidCreation_DebitCardNoName)
                    .expect(201)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("name");
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("cardNumber", ValidCreation_DebitCardNoName.cardNumber);
                expect(returnedCard).to.have.property("balance",    ValidCreation_DebitCardNoName.balance);
                expect(returnedCard).to.have.property("type",       ValidCreation_DebitCardNoName.type);
                expect(returnedCard).to.have.property("bankId",     ValidCreation_DebitCardNoName.bankId);
                expect(returnedCard).to.have.property("archived",   false);
                expect(returnedCard).to.have.property("isVoucher",  false);
                expect(returnedCard).to.have.property("limit",      0);
            });
        });
        describe("Given a valid payload for credit card", function() {
            it("Then return '201 Created' and ICard object if required payload parameters are sent", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(ValidCreation_CreditCardSimple)
                    .expect(201)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("name",       ValidCreation_CreditCardSimple.name);
                expect(returnedCard).to.have.property("cardNumber", ValidCreation_CreditCardSimple.cardNumber);
                expect(returnedCard).to.have.property("bankId",     ValidCreation_CreditCardSimple.bankId);
                expect(returnedCard).to.have.property("balance",    ValidCreation_CreditCardSimple.balance);
                expect(returnedCard).to.have.property("type",       ValidCreation_CreditCardSimple.type);
                expect(returnedCard).to.have.property("limit",      ValidCreation_CreditCardSimple.limit);
                expect(returnedCard).to.have.property("archived",   false);
                expect(returnedCard).to.have.property("isVoucher",  false);
            });
            it("Then return '201 Created' and ICard object if no name was provided in payload", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(ValidCreation_CreditCardNoName)
                    .expect(201)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("name");
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("cardNumber", ValidCreation_CreditCardNoName.cardNumber);
                expect(returnedCard).to.have.property("bankId",     ValidCreation_CreditCardNoName.bankId);
                expect(returnedCard).to.have.property("balance",    ValidCreation_CreditCardNoName.balance);
                expect(returnedCard).to.have.property("type",       ValidCreation_CreditCardNoName.type);
                expect(returnedCard).to.have.property("limit",      ValidCreation_CreditCardNoName.limit);
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
                expect(res.body).to.have.property("info", "Malformed payload sent.");
            });
            it("Then return '400 Bad Request Error' if an invalid type is used", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(InvalidCreation_CardTypeIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Invalid type (${InvalidCreation_CardTypeIsIncorrect.type}) for creating a new card.`);
            });
            it("Then return '400 Bad Request Error' if a non existing bank id is used", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(InvalidCreation_BankDoesNotExist)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Invalid bank id (${InvalidCreation_BankDoesNotExist.bankId}) for creating a new card.`);
            });
            it("Then return '400 Bad Request Error' if a card number contains non numeric chars", async function() {
                const res = await agent
                    .set("cardType", "1")
                    .post(cardPath)
                    .send(InvalidCreation_CardNumberIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Invalid card number "${InvalidCreation_CardNumberIsIncorrect.cardNumber}". A card number can not contain non numeric chars.`);
            });
            it("Then return '400 Bad Request Error' if a card already exists with the given card number", async function() {
                const res = await agent
                    .set("cardType", "1")
                    .post(cardPath)
                    .send(InvalidCreation_DuplicatedCard)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `A card with the "${InvalidCreation_DuplicatedCard.cardNumber}" number already exists.`);
            });
        });
        describe("Given an invalid payload for debit card", function() {
            it("Then return '400 Bad Request Error' if a limit was attempted to be set in a debit card", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(InvalidCreation_DebitCardHasLimit)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "A debit card can't have a limit.");
            });
        });
        describe("Given an invalid payload for credit card", function() {
            it("Then return '400 Bad Request Error' if no limit was included", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(InvalidCreation_CreditCardNoLimit)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "No limit value was given to create the new credit card.");
            });
            it("Then return '400 Bad Request Error' if an incorrect limit was used", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(InvalidCreation_CreditCardLimitIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "Can't set the limit of a credit card to have a value of less or equal to 0.");
            });
            it("Then return '400 Bad Request Error' if isVoucher was used", async function() {
                const res = await agent
                    .post(cardPath)
                    .send(InvalidCreation_CreditCardIsVoucher)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "A credit card can't be categorized as a voucher card.");
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
                    .query({ cardType: true })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "Invalid type for filtering cards.");
            });
            it("Then return '400 Bad Request Error' if card type filter is -1", async function() {
                const res = await agent
                    .get(cardPath)
                    .query({ cardType: -1 })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "Invalid type for filtering cards.");
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
                    .put(`${cardPath}/${ValidCreation_DebitCardNoName.cardNumber}`)
                    .send(ValidUpdate_DebitCardSimple)
                    .expect(200)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("balance",    ValidCreation_DebitCardNoName.balance);
                expect(returnedCard).to.have.property("bankId",     ValidCreation_DebitCardNoName.bankId);
                expect(returnedCard).to.have.property("type",       ValidCreation_DebitCardNoName.type);
                expect(returnedCard).to.have.property("cardNumber", ValidUpdate_DebitCardSimple.cardNumber);
                expect(returnedCard).to.have.property("name",       ValidUpdate_DebitCardSimple.name);
                expect(returnedCard).to.have.property("archived",   ValidUpdate_DebitCardSimple.archived);
                expect(returnedCard).to.have.property("expires",    ValidUpdate_DebitCardSimple.expires);
                expect(returnedCard).to.have.property("isVoucher",  false);
            });
            it("Then return '200 Success' and ICard object if debit card was updated to be a credit card", async function() {
                const res = await agent
                    .put(`${cardPath}/${ValidUpdate_DebitCardSimple.cardNumber}`)
                    .send(ValidUpdate_DebitCardIsNowCredit)
                    .expect(200)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("balance",    ValidCreation_DebitCardNoName.balance);
                expect(returnedCard).to.have.property("bankId",     ValidCreation_DebitCardNoName.bankId);
                expect(returnedCard).to.have.property("cardNumber", ValidUpdate_DebitCardSimple.cardNumber);
                expect(returnedCard).to.have.property("archived",   ValidUpdate_DebitCardSimple.archived);
                expect(returnedCard).to.have.property("expires",    ValidUpdate_DebitCardSimple.expires);
                expect(returnedCard).to.have.property("name",       ValidUpdate_DebitCardIsNowCredit.name);
                expect(returnedCard).to.have.property("type",       ValidUpdate_DebitCardIsNowCredit.type);
                expect(returnedCard).to.have.property("limit",      ValidUpdate_DebitCardIsNowCredit.limit);
                expect(returnedCard).to.have.property("isVoucher",  false);
                expect(returnedCard).to.have.property("userId");
            });
            it("Then return '200 Success' and ICard object if debit voucher card was updated to be a credit card", async function() {
                const res = await agent
                    .put(`${cardPath}/${ValidCreation_DebitCardIsVoucher.cardNumber}`)
                    .send(ValidUpdate_VoucherCardIsNowCredit)
                    .expect(200)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("balance",    ValidCreation_DebitCardIsVoucher.balance);
                expect(returnedCard).to.have.property("bankId",     ValidCreation_DebitCardIsVoucher.bankId);
                expect(returnedCard).to.have.property("cardNumber", ValidCreation_DebitCardIsVoucher.cardNumber);
                expect(returnedCard).to.have.property("expires");
                expect(returnedCard).to.have.property("name",       ValidUpdate_VoucherCardIsNowCredit.name);
                expect(returnedCard).to.have.property("type",       ValidUpdate_VoucherCardIsNowCredit.type);
                expect(returnedCard).to.have.property("limit",      ValidUpdate_VoucherCardIsNowCredit.limit);
                expect(returnedCard).to.have.property("archived",   false);
                expect(returnedCard).to.have.property("isVoucher",  false);
            });
        });
        describe("Given a valid payload for credit card", function() {
            it("Then return '200 Success' and ICard object if credit card was updated to be a debit card", async function() {
                const res = await agent
                    .put(`${cardPath}/${ValidCreation_CreditCardSimple.cardNumber}`)
                    .send(ValidUpdate_CreditCardIsNowDebit)
                    .expect(200)
                    .expect("Content-Type", /json/);
                const returnedCard = res.body as ICard;
                expect(returnedCard).to.have.property("id");
                expect(returnedCard).to.have.property("userId");
                expect(returnedCard).to.have.property("cardNumber", ValidCreation_CreditCardSimple.cardNumber);
                expect(returnedCard).to.have.property("balance",    ValidCreation_CreditCardSimple.balance);
                expect(returnedCard).to.have.property("bankId",     ValidCreation_CreditCardSimple.bankId);
                expect(returnedCard).to.have.property("expires",    ValidUpdate_CreditCardIsNowDebit.expires);
                expect(returnedCard).to.have.property("name",       ValidUpdate_CreditCardIsNowDebit.name);
                expect(returnedCard).to.have.property("type",       ValidUpdate_CreditCardIsNowDebit.type);
                expect(returnedCard).to.have.property("archived",   ValidUpdate_CreditCardIsNowDebit.archived);
                expect(returnedCard).to.have.property("limit",      0);
                expect(returnedCard).to.have.property("isVoucher",  false);
            });
        });
        describe("Given an invalid payload", function() {
            it("Then return '400 Bad Request Error' if card number contains non numeric chars", async function() {
                const res = await agent
                    .put(`${cardPath}/${InvalidUpdate_CardNumberIsIncorrect}`)
                    .send(ValidUpdate_DebitCardSimple)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Invalid card number "${InvalidUpdate_CardNumberIsIncorrect}". A card number can not contain non numeric chars.`);
            });
            it("Then return '404 Not Found Error' if card number does no exist in user cards", async function() {
                const res = await agent
                    .put(`${cardPath}/${InvalidUpdate_CardDoesNotExist}`)
                    .send(ValidUpdate_DebitCardSimple)
                    .expect(404)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The requested resource could not be found.");
                expect(res.body).to.have.property("info", `There is no "${InvalidUpdate_CardDoesNotExist}" card to update.`);
            });
            it("Then return '400 Bad Request Error' if new card number contains non numeric chars", async function() {
                const res = await agent
                    .put(`${cardPath}/${ValidCreation_DebitCardSimple.cardNumber}`)
                    .send(InvalidUpdate_NewCardIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Invalid new card number "${InvalidUpdate_NewCardIsIncorrect.cardNumber}". A card number can not contain non numeric chars.`);
            });
            it("Then return '400 Bad Request Error' if new card number already exists in user information", async function() {
                const res = await agent
                    .put(`${cardPath}/${ValidCreation_DebitCardSimple.cardNumber}`)
                    .send(InvalidUpdate_DuplicatedCard)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `A card with the "${InvalidUpdate_DuplicatedCard.cardNumber}" number already exists.`);
            });
            it("Then return '400 Bad Request Error' if expiration date is incorrect", async function() {
                const res = await agent
                    .put(`${cardPath}/${ValidCreation_DebitCardSimple.cardNumber}`)
                    .send(InvalidUpdate_ExpirationDateIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `New expiration date "${InvalidUpdate_ExpirationDateIsIncorrect.expires}" can't be less than today's date.`);
            });
            it("Then return '400 Bad Request Error' if new card type is incorrect", async function() {
                const res = await agent
                    .put(`${cardPath}/${ValidCreation_CreditCardNoName.cardNumber}`)
                    .send(InvalidUpdate_CardTypeIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Invalid card type: "${InvalidUpdate_CardTypeIsIncorrect.type}" given for updating "${ValidCreation_CreditCardNoName.cardNumber}" card.`);
            });
            it("Then return '400 Bad Request Error' if credit card is now debit card and has a limit", async function() {
                const res = await agent
                    .put(`${cardPath}/${ValidCreation_CreditCardNoName.cardNumber}`)
                    .send(InvalidUpdate_CreditIsNowDebitAndHasLimit)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Can't update the limit of "${ValidCreation_CreditCardNoName.cardNumber}" card if it's going to be a Debit Card.`);
            });
            it("Then return '400 Bad Request Error' if debit card is now credit card and has no limit", async function() {
                const res = await agent
                    .put(`${cardPath}/${ValidCreation_DebitCardSimple.cardNumber}`)
                    .send(InvalidUpdate_DebitIsNowCreditAndHasNoLimit)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `No limit value was provided for updating "${ValidCreation_DebitCardSimple.cardNumber}" card to be a Credit Card.`);
            });
            it("Then return '400 Bad Request Error' if debit card is now credit card and limit is incorrect", async function() {
                const res = await agent
                    .put(`${cardPath}/${ValidCreation_DebitCardSimple.cardNumber}`)
                    .send(InvalidUpdate_DebitIsNowCreditAndLimitIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "Can't set the limit of a credit card to have a value of less or equal to 0.");
            });
            it("Then return '400 Bad Request Error' if a limit was attempted to be set in a debit card", async function() {
                const res = await agent
                    .put(`${cardPath}/${ValidCreation_DebitCardSimple.cardNumber}`)
                    .send(InvalidUpdate_DebitCardHasLimit)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "Can't modify the limit attribute of a non credit card.");
            });
            it("Then return '400 Bad Request Error' if an incorrect limit was used in a credit card", async function() {
                const res = await agent
                    .put(`${cardPath}/${ValidCreation_CreditCardNoName.cardNumber}`)
                    .send(InvalidUpdate_CreditCardLimitIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "Can't modify the limit of a credit card to have a value of less or equal to 0.");
            });
            it("Then return '400 Bad Request Error' if voucher state was used to update a credit card", async function() {
                const res = await agent
                    .put(`${cardPath}/${ValidCreation_CreditCardNoName.cardNumber}`)
                    .send(InvalidUpdate_CreditCardIsVoucher)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "Can't modify the voucher state of a non debit card.");
            });
        });
    });
    // #endregion Update Cards Tests
});
