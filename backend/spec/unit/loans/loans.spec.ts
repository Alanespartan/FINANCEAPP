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
