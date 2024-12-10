/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";
import { DefaultCategories, IExpenseCategory } from "../../../../common/types/expenses";
import { agent, version } from "../../setup";
import * as payloads from "./payloads";

const categoriesPath = `/api/${version}/expenses/categories`;

describe(`Testing API: ${categoriesPath}`, function() {
    // #region Create Categories
    describe("When Creating a Category", function() {
        describe("Given a valid payload", function() {
            it("Then return '201 Created' and IExpenseCategory object if required payload parameters are sent", async function() {
                const res = await agent
                    .post(categoriesPath)
                    .send(payloads.ValidCreation_ExpenseCategorySimple)
                    .expect(201)
                    .expect("Content-Type", /json/);
                // Check response is an object
                expect(res.body).to.be.an("object");

                // Check required properties and types
                const returnedCategory = res.body as IExpenseCategory;
                console.log(returnedCategory);
                expect(returnedCategory).to.have.property("id");
                expect(returnedCategory).to.have.property("userId");
                expect(returnedCategory).to.have.property("name", payloads.ValidCreation_ExpenseCategorySimple.name);
                expect(returnedCategory).to.have.property("isDefault", payloads.ValidCreation_ExpenseCategorySimple.isDefault);

                // Validate subcategories array (must be empty)
                expect(returnedCategory).to.have.property("subcategories").that.is.an("array").and.to.have.lengthOf(0);
            });
        });
        describe("Given an invalid payload", function() {
            it("Then return '400 Bad Request Error' if a malformed payload is used", async function() {
                const res = await agent
                    .post(categoriesPath)
                    .send({
                        incorrectProp1: "",
                        nonExistingProp: 2
                    })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "New category cannot be created because a malformed payload sent.");
            });
        });
    });
    // #endregion Create Categories
    // #region Fetch Categories
    describe("When Fetching Categories", function() {
        describe("Given no filter", function() {
            it("Then return '200 Success' and array of all created categories", async function() {
                const res = await agent
                    .get(categoriesPath)
                    .expect(200)
                    .expect("Content-Type", /json/);

                // Ensure the response is an array
                expect(res.body).to.be.an("array");

                console.log(res.body);

                // Validate each entity against IExpenseCategory
                res.body.forEach((category: any) => {
                    // Check required properties and types
                    expect(category).to.be.an("object");
                    expect(category).to.have.property("id").that.is.a("number");
                    expect(category).to.have.property("name").that.is.a("string");
                    expect(category).to.have.property("isDefault").that.is.a("boolean");
                    expect(category).to.have.property("userId").that.is.a("number");

                    // Validate subcategories array
                    expect(category).to.have.property("subcategories").that.is.an("array");

                    // Optionally validate each subcategory
                    category.subcategories.forEach((sub: any) => {
                        expect(sub).to.be.an("object");
                        expect(sub).to.have.property("id").that.is.a("number");
                        expect(sub).to.have.property("name").that.is.a("string");
                        expect(sub).to.have.property("userId").that.is.a("number");

                        // Validate 'type' attribute that has the TExpenseType form
                        expect(sub).to.have.property("type").that.is.oneOf([ 1, 2, 3 ]);

                        // Validate 'instrumentId' attribute
                        expect(sub).to.have.property("instrumentId");
                        if(sub.instrumentId !== undefined) {
                            expect(sub.instrumentId).to.be.a("number");
                        }
                    });
                });
            });
        });
        describe("Given an invalid onlyDefault filter", function() {
            it("Then return '400 Bad Request Error' if onlyDefault filter is not in correct string format", async function() {
                const res = await agent
                    .get(categoriesPath)
                    .query({ onlyDefault: [ true, false ] })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "Categories cannot be obtained because the onlyDefault filter provided was in an incorrect format.");
            });
            it("Then return '400 Bad Request Error' if onlyDefault filter is incorrect boolean string", async function() {
                const incorrectFilter = "truee";
                const res = await agent
                    .get(categoriesPath)
                    .query({ onlyDefault: incorrectFilter })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Categories cannot be obtained because an incorrect onlyDefault filter was used in the request: ${incorrectFilter}.`);
            });
        });
        describe("Given a valid filter", function() {
            it("Then return '200 Success' and array of all default categories if onlyDefault is true", async function() {
                const res = await agent
                    .get(categoriesPath)
                    .query({ onlyDefault: true })
                    .expect(200)
                    .expect("Content-Type", /json/);

                // Ensure the response is an array
                expect(res.body).to.be.an("array");
                // Ensure the length matches the default categories array size value
                expect(res.body).to.have.lengthOf(DefaultCategories.length);
            });
            it("Then return '200 Success' and array of all non default categories if onlyDefault is false", async function() {
                const res = await agent
                    .get(categoriesPath)
                    .query({ onlyDefault: false })
                    .expect(200)
                    .expect("Content-Type", /json/);

                // Ensure the response is an array
                expect(res.body).to.be.an("array");
                // Ensure the length matches the default categories array size value
                expect(res.body).to.have.lengthOf(1);

            });
        });
    });
    // #endregion Fetch Categories
});
