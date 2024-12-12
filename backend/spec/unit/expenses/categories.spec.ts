/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";
import { DefaultCategories, IExpenseCategory } from "../../../../common/types/expenses";
import { agent, version } from "../../setup";
import { validateExpenseCategories, validateExpenseCategory } from "./functions";
import * as payloads from "./payloads";

const categoriesPath = `/api/${version}/expenses/categories`;

describe(`Testing API: ${categoriesPath}`, function() {
    // #region POST Category
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
                const category = res.body as IExpenseCategory;
                expect(category).to.have.property("id").that.is.a("number");
                expect(category).to.have.property("userId").that.is.a("number");
                expect(category).to.have.property("name", payloads.ValidCreation_ExpenseCategorySimple.name);
                expect(category).to.have.property("isDefault", false);

                // Validate subcategories array (must be empty)
                expect(category).to.have.property("subcategories").that.is.an("array").and.to.have.lengthOf(0);
            });
            it("Then return '201 Created' and IExpenseCategory object if multiple categories are created successfully", async function() {
                // Send all requests concurrently
                const responses = await Promise.all(
                    payloads.ValidCreation_DummyExpenseCategories.map((category) => agent
                        .post(categoriesPath)
                        .send(category)
                        .expect(201)
                        .expect("Content-Type", /json/)
                    )
                );

                // Assertions for all responses
                responses.forEach((response, index) => {
                    // Check response is an object
                    expect(response.body).to.be.an("object");

                    // Check required properties and types
                    const category = response.body as IExpenseCategory;
                    expect(category).to.have.property("id").that.is.a("number");
                    expect(category).to.have.property("userId").that.is.a("number");
                    expect(category).to.have.property("name", payloads.ValidCreation_DummyExpenseCategories[index].name);
                    expect(category).to.have.property("isDefault", false);

                    // Validate subcategories array (must be empty)
                    expect(category).to.have.property("subcategories").that.is.an("array").and.to.have.lengthOf(0);
                });
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
                expect(res.body).to.have.property("info", "New category cannot be created because a malformed payload was sent.");
            });
            it("Then return '400 Bad Request Error' if a default category is attempted to be created", async function() {
                const dummyName = "THIS MUST FAIL AND NOT BE SAVED";
                const res = await agent
                    .post(categoriesPath)
                    .send({
                        name: dummyName,
                        isDefault: true
                    })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Category "${dummyName}" cannot be created because user is not allowed to create a default category.`);
            });
            it("Then return '400 Bad Request Error' if a category already exists with the given name", async function() {
                const res = await agent
                    .post(categoriesPath)
                    .send(payloads.ValidCreation_ExpenseCategorySimple)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Category "${payloads.ValidCreation_ExpenseCategorySimple.name}" cannot be created because one with that name already exists.`);
            });
        });
    });
    // #endregion POST Category
    // #region GET Categories
    describe("When Fetching Categories", function() {
        describe("Given no filter", function() {
            it("Then return '200 Success' and array of all created categories", async function() {
                const res = await agent
                    .get(categoriesPath)
                    .expect(200)
                    .expect("Content-Type", /json/);

                // Ensure the response is an array
                expect(res.body).to.be.an("array");
                // Ensure the length matches the default categories array size value + multiple dummy creations + simple creation test
                expect(res.body).to.have.lengthOf(DefaultCategories.length + payloads.ValidCreation_DummyExpenseCategories.length + 1);
                // Validate each entity against IExpenseCategory interface
                validateExpenseCategories(res.body);
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
                // Validate each entity against IExpenseCategory interface
                validateExpenseCategories(res.body);
            });
            it("Then return '200 Success' and array of all non default categories if onlyDefault is false", async function() {
                const res = await agent
                    .get(categoriesPath)
                    .query({ onlyDefault: false })
                    .expect(200)
                    .expect("Content-Type", /json/);

                // Ensure the response is an array
                expect(res.body).to.be.an("array");
                // Ensure the length matches the default categories array size value + simple creation test
                expect(res.body).to.have.lengthOf(payloads.ValidCreation_DummyExpenseCategories.length + 1);
                // Validate each entity against IExpenseCategory interface
                validateExpenseCategories(res.body);
            });
        });
    });
    // #endregion GET Categories
    // #region GET Category
    describe("When Fetching a Category", function() {
        describe("Given an invalid id", function() {
            it("Then return '400 Bad Request Error' if category id has incorrect format", async function() {
                const id = "idIsNotANumber";
                const res = await agent
                    .get(`${categoriesPath}/${id}`)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Category cannot be obtained because the provided id "${id}" was in an incorrect format.`);
            });
            it("Then return '404 Not Found Error' if category does not exist in user expense categories", async function() {
                const id = -1;
                const res = await agent
                    .get(`${categoriesPath}/${id}`)
                    .expect(404)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The requested resource could not be found.");
                expect(res.body).to.have.property("info", `Category "${id}" cannot be obtained because it does not exist in user data.`);
            });
        });
        describe("Given a valid category id", function() {
            it("Then return '200 Success' and IExpenseCategory object", async function() {
                const res = await agent
                    .get(`${categoriesPath}/1`)
                    .expect(200)
                    .expect("Content-Type", /json/);
                // Validate entity against IExpenseCategory interface
                validateExpenseCategory(res.body);
            });
        });
    });
    // #endregion GET Category
    // #region PUT Category
    describe("When Updating a Category", function() {
        describe("Given an invalid id", function() {
            it("Then return '400 Bad Request Error' if category id has incorrect format", async function() {
                const id = "idIsNotANumber";
                const res = await agent
                    .put(`${categoriesPath}/${id}`)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Category cannot be updated because the provided id "${id}" was in an incorrect format.`);
            });
            it("Then return '404 Not Found Error' if category does not exist in user expense categories", async function() {
                const id = -1;
                const res = await agent
                    .put(`${categoriesPath}/${id}`)
                    .send({
                        name: "This should not be applied"
                    })
                    .expect(404)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The requested resource could not be found.");
                expect(res.body).to.have.property("info", `Category "${id}" cannot be updated because it does not exist in user data.`);
            });
            it("Then return '400 Bad Request Error' if user is trying to update a default category", async function() {
                const id = 1;
                const res = await agent
                    .put(`${categoriesPath}/${id}`)
                    .send({
                        name: "This should not be applied to the default category"
                    })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Category "${id}" cannot be updated because it is an app default category.`);
            });
        });
        describe("Given an invalid payload", function() {
            it("Then return '400 Bad Request Error' if a malformed payload is used", async function() {
                const id = 1;
                const res = await agent
                    .put(`${categoriesPath}/${id}`)
                    .send({
                        incorrectProp1: "",
                        nonExistingProp: 2
                    })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Category "${id}" cannot be updated because a malformed payload was sent.`);
            });
        });
        describe("Given a valid payload and id", function() {
            it("Then return '200 Success' and IExpenseCategory object if required payload parameters are sent", async function() {
                const id = DefaultCategories.length + 1;
                const res = await agent
                    .put(`${categoriesPath}/${id}`)
                    .send(payloads.ValidUpdate_ExpenseCategorySimple)
                    .expect(200)
                    .expect("Content-Type", /json/);
                // Validate entity against IExpenseCategory interface
                validateExpenseCategory(res.body);
                // validate updated attribute
                expect(res.body).to.have.property("name", payloads.ValidUpdate_ExpenseCategorySimple.name);
            });
        });
    });
    // #endregion PUT Category
});
