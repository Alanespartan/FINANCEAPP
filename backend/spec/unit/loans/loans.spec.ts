/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";
import { agent, version } from "../../setup";
import { expectBadRequestError, expectNotFoundError } from "../../util/errors";
import { validateLoans, validateLoan } from "./functions";
import * as payloads from "./payloads";

const loansPath = `/api/${version}/loans`;

describe(`Testing API: ${loansPath}`, function() {
    // #region POST Loan
    describe("When Creating a Loan", function() {
        describe("Given a valid payload", function() {
            it("Then return '201 Created' and ILoan object if required payload parameters are sent", async function() {
                const res = await agent
                    .post(loansPath)
                    .send(payloads.ValidCreation_LoanSimple)
                    .expect(201)
                    .expect("Content-Type", /json/);
                // Validate entity against ILoan interface
                validateLoan(res.body);
            });
            it("Then return '201 Created' and ILoan object if multiple loans are created successfully", async function() {
                // Send all requests concurrently
                const responses: any = [];
                for(const loan of payloads.ValidCreation_MultipleDummyLoans) {
                    const res = await agent
                        .post(loansPath)
                        .send(loan)
                        .expect(201)
                        .expect("Content-Type", /json/);
                    responses.push(res);
                }

                // Assertions for all responses
                responses.forEach((response: any, ) => {
                    // Validate entity against ILoan interface
                    validateLoan(response.body);
                });
            });
        });
        describe("Given an invalid payload", function() {
            it("Then return '400 Bad Request Error' if a malformed payload is used", async function() {
                const res = await agent
                    .post(loansPath)
                    .send({
                        incorrectProp1: "",
                        nonExistingProp: 2
                    })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expectBadRequestError(res.body, "New loan cannot be created because a malformed payload was sent.");
            });
            it("Then return '400 Bad Request Error' if a non existing bank id is used", async function() {
                const res = await agent
                    .post(loansPath)
                    .send(payloads.InvalidCreation_BankDoesNotExist)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expectBadRequestError(res.body, `Loan "${payloads.InvalidCreation_BankDoesNotExist.name}" cannot be created because an incorrect bank id was used in the request: ${payloads.InvalidCreation_BankDoesNotExist.bankId}.`);
            });
            it("Then return '400 Bad Request Error' if a loan already exists with the given name", async function() {
                const res = await agent
                    .post(loansPath)
                    .send(payloads.InvalidCreation_DuplicatedLoan)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expectBadRequestError(res.body, `Loan "${payloads.InvalidCreation_DuplicatedLoan.name}" cannot be created because one with that name already exists.`);
            });
            it("Then return '400 Bad Request Error' if expiration date is incorrect", async function() {
                const res = await agent
                    .post(`${loansPath}`)
                    .send(payloads.InvalidCreation_ExpirationDateIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expectBadRequestError(res.body, `Loan "${payloads.InvalidCreation_ExpirationDateIsIncorrect.name}" cannot be created because expiration date "${payloads.InvalidCreation_ExpirationDateIsIncorrect.expires}" can't be less than today's date.`);
            });
            it("Then return '400 Bad Request Error' if borrowed amount is incorrect", async function() {
                const res = await agent
                    .post(`${loansPath}`)
                    .send(payloads.InvalidCreation_BorrowedIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expectBadRequestError(res.body, `Loan "${payloads.InvalidCreation_BorrowedIsIncorrect.name}" cannot be created because an incorrect "borrowed" value was used in the request: ${payloads.InvalidCreation_BorrowedIsIncorrect.borrowed}.`);
            });
            it("Then return '400 Bad Request Error' if fixed payment amount is incorrect", async function() {
                const res = await agent
                    .post(`${loansPath}`)
                    .send(payloads.InvalidCreation_FixedPaymentAmountIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expectBadRequestError(res.body, `Loan "${payloads.InvalidCreation_FixedPaymentAmountIsIncorrect.name}" cannot be created because an incorrect "fixedPaymentAmount" value was used in the request: ${payloads.InvalidCreation_FixedPaymentAmountIsIncorrect.fixedPaymentAmount}.`);
            });
            it("Then return '400 Bad Request Error' if interests to pay amount is incorrect", async function() {
                const res = await agent
                    .post(`${loansPath}`)
                    .send(payloads.InvalidCreation_InterestsToPayIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expectBadRequestError(res.body, `Loan "${payloads.InvalidCreation_InterestsToPayIsIncorrect.name}" cannot be created because an incorrect "interestsToPay" value was used in the request: ${payloads.InvalidCreation_InterestsToPayIsIncorrect.fixedPaymentAmount}.`);
            });
            it("Then return '400 Bad Request Error' if interests to pay amount is greater than borrowed money", async function() {
                const res = await agent
                    .post(`${loansPath}`)
                    .send(payloads.InvalidCreation_InterestsToPayIsGreaterThanBorrowedMoney)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expectBadRequestError(res.body, `Loan "${payloads.InvalidCreation_InterestsToPayIsGreaterThanBorrowedMoney.name}" cannot be created because interests debt "${payloads.InvalidCreation_InterestsToPayIsGreaterThanBorrowedMoney.interestsToPay}" can't be greater than borrowed "${payloads.InvalidCreation_InterestsToPayIsGreaterThanBorrowedMoney.borrowed}" money.`);
            });
            it("Then return '400 Bad Request Error' if annual interest rate is incorrect", async function() {
                const res = await agent
                    .post(`${loansPath}`)
                    .send(payloads.InvalidCreation_AnnualInterestRateIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expectBadRequestError(res.body, `Loan "${payloads.InvalidCreation_AnnualInterestRateIsIncorrect.name}" cannot be created because an incorrect "annualInterestRate" value was used in the request: ${payloads.InvalidCreation_AnnualInterestRateIsIncorrect.annualInterestRate}.`);
            });
            it("Then return '400 Bad Request Error' if an invalid pay frequency type is used", async function() {
                const res = await agent
                    .post(loansPath)
                    .send(payloads.InvalidCreation_PayFrequencyIsIncorrect)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expectBadRequestError(res.body, `Loan "${payloads.InvalidCreation_PayFrequencyIsIncorrect.name}" cannot be created because an incorrect pay frequency type was used in the request: ${payloads.InvalidCreation_PayFrequencyIsIncorrect.payFrequency}.`);
            });
        });
    });
    // #endregion POST Loan
    // #region GET Loans
    describe("When Fetching Loans", function() {
        describe("Given no filter", function() {
            it("Then return '200 Success' and array of all created loans", async function() {
                const res = await agent
                    .get(loansPath)
                    .expect(200)
                    .expect("Content-Type", /json/);
                // Ensure the response is an array
                expect(res.body).to.be.an("array");
                // Ensure the length matches the multiple dummy creations length + simple creation test
                expect(res.body).to.have.lengthOf(payloads.ValidCreation_MultipleDummyLoans.length + 1);
                // Validate each entity against ILoan interface
                validateLoans(res.body);
            });
        });
        describe("Given invalid filters", function() {
            // TODO
        });
    });
    // #endregion GET Loans
    // #region GET Loan
    describe("When Fetching a Loan", function() {
        describe("Given an invalid id", function() {
            it("Then return '400 Bad Request Error' if loan id has incorrect format", async function() {
                const id = "idIsNotANumber";
                const res = await agent
                    .get(`${loansPath}/${id}`)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expectBadRequestError(res.body, `Loan cannot be obtained because the provided id "${id}" was in an incorrect format.`);
            });
            it("Then return '400 Bad Request Error' if loan id is negative", async function() {
                const id = -1;
                const res = await agent
                    .get(`${loansPath}/${id}`)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expectBadRequestError(res.body, `Loan cannot be obtained because the provided id "${id}" was in an incorrect format.`);
            });
            it("Then return '404 Not Found Error' if loan does not exist in user loans", async function() {
                const id = 155123;
                const res = await agent
                    .get(`${loansPath}/${id}`)
                    .expect(404)
                    .expect("Content-Type", /json/);
                expectNotFoundError(res.body, `Loan "${id}" cannot be obtained because it does not exist in user data.`);
            });
        });
        describe("Given a valid loan id", function() {
            it("Then return '200 Success' and ILoan object", async function() {
                const res = await agent
                    .get(`${loansPath}/1`)
                    .expect(200)
                    .expect("Content-Type", /json/);
                // Validate entity against ILoan interface
                validateLoan(res.body);
            });
        });
    });
    // #endregion GET Loan
});
