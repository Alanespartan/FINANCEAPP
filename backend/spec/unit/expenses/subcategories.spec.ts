/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";
import { agent, version } from "../../setup";
import { validateExpenseSubCategories, validateExpenseSubcategory } from "./functions";
import * as payloads from "./payloads";

const subCategoriesPath = `/api/${version}/expenses/subcategories`;
let lastCreatedId = 0;

describe(`Testing API: ${subCategoriesPath}`, function() {
    // #region POST Sub Category
    describe("When Creating a Sub Category", function() {
        describe("Given an invalid payload", function() {
            it("Then return '400 Bad Request Error' if a malformed payload is used", async function() {
                const res = await agent
                    .post(subCategoriesPath)
                    .send({
                        incorrectProp1: "",
                        nonExistingProp: 2
                    })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "New subcategory cannot be created because a malformed payload was sent.");
            });
            it("Then return '400 Bad Request Error' if an invalid sub category type is used", async function() {
                const res = await agent
                    .post(subCategoriesPath)
                    .send(payloads.InvalidCreation_ExpenseSubCategory_IncorrectType)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Subcategory "${payloads.InvalidCreation_ExpenseSubCategory_IncorrectType.name}" cannot be created because an incorrect type was used in the request: ${payloads.InvalidCreation_ExpenseSubCategory_IncorrectType.type}.`);
            });
            it("Then return '400 Bad Request Error' if parent category does not exists", async function() {
                const res = await agent
                    .post(subCategoriesPath)
                    .send(payloads.InvalidCreation_ExpenseSubCategory_ParentDoesNotExist)
                    .expect(404)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The requested resource could not be found.");
                expect(res.body).to.have.property("info", `Parent category cannot be obtained because an incorrect parent id was used in the request: ${payloads.InvalidCreation_ExpenseSubCategory_ParentDoesNotExist.categoryId}.`);
            });
            it("Then return '400 Bad Request Error' if a sub category already exists with the given name", async function() {
                const res = await agent
                    .post(subCategoriesPath)
                    .send(payloads.InvalidCreation_ExpenseSubCategory_Duplicated)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Subcategory "${payloads.InvalidCreation_ExpenseSubCategory_Duplicated.name}" cannot be created because one with that name already exists.`);
            });
        });
        describe("Given a valid payload", function() {
            it("Then return '201 Created' and IExpenseSubCategory object if required payload parameters are sent", async function() {
                const res = await agent
                    .post(subCategoriesPath)
                    .send(payloads.ValidCreation_ExpenseSubCategory_SimpleTest)
                    .expect(201)
                    .expect("Content-Type", /json/);
                // Validate entity against IExpenseSubCategory interface
                validateExpenseSubcategory(res.body);

                // Check required properties and types
                expect(res.body).to.have.property("type", payloads.ValidCreation_ExpenseSubCategory_SimpleTest.type);
                expect(res.body).to.have.property("name", payloads.ValidCreation_ExpenseSubCategory_SimpleTest.name);
            });
            it("Then return '201 Created' and IExpenseSubCategory objects if multiple sub categories are created successfully", async function() {
                // Send all requests concurrently
                const responses = await Promise.all(
                    payloads.ValidCreation_ExpenseSubCategory_MultipleDummy.map((category) => agent
                        .post(subCategoriesPath)
                        .send(category)
                        .expect(201)
                        .expect("Content-Type", /json/)
                    )
                );

                // Assertions for all responses
                responses.forEach((response, index) => {
                    // Validate entity against IExpenseSubCategory interface
                    validateExpenseSubcategory(response.body);

                    // Check required properties and types
                    expect(response.body).to.have.property("type", payloads.ValidCreation_ExpenseSubCategory_MultipleDummy[index].type);
                    expect(response.body).to.have.property("name", payloads.ValidCreation_ExpenseSubCategory_MultipleDummy[index].name);

                    lastCreatedId = response.body.id;
                });
            });
        });
    });
    // #endregion POST Sub Category
    // #region GET Sub Categories
    describe("When Fetching Sub Categories", function() {
        describe("Given no filter", function() {
            it("Then return '200 Success' and array of all created categories", async function() {
                const res = await agent
                    .get(subCategoriesPath)
                    .expect(200)
                    .expect("Content-Type", /json/);

                // Ensure the response is an array
                expect(res.body).to.be.an("array");
                expect(res.body).to.have.lengthOf(9);
                // Validate each entity against IExpenseCategory interface
                validateExpenseSubCategories(res.body);
            });
        });
        describe("Given an invalid type filter", function() {
            it("Then return '400 Bad Request Error' if type filter is not in correct string format", async function() {
                const res = await agent
                    .get(subCategoriesPath)
                    .query({ type: [ true, false ] })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "Subcategories cannot be obtained because the type filter provided was in an incorrect format.");
            });
            it("Then return '400 Bad Request Error' if type filter has incorrect value", async function() {
                const incorrectFilter = -1;
                const res = await agent
                    .get(subCategoriesPath)
                    .query({ type: incorrectFilter })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Subcategories cannot be obtained because an incorrect type filter was used in the request: ${incorrectFilter}.`);
            });
        });
        describe("Given a valid filter", function() {
            it("Then return '200 Success' and array of all expense sub categories if type filter is 0", async function() {
                const res = await agent
                    .get(subCategoriesPath)
                    .query({ type: 0 })
                    .expect(200)
                    .expect("Content-Type", /json/);

                // Ensure the response is an array
                expect(res.body).to.be.an("array");
                expect(res.body).to.have.lengthOf(9);
                // Validate each entity against IExpenseCategory interface
                validateExpenseSubCategories(res.body);
            });
            it("Then return '200 Success' and array of all real expense sub categories if type filter is 1", async function() {
                const res = await agent
                    .get(subCategoriesPath)
                    .query({ type: 1 })
                    .expect(200)
                    .expect("Content-Type", /json/);

                // Ensure the response is an array
                expect(res.body).to.be.an("array");
                // Ensure the length matches the amount of real expense categories created in prior tests
                expect(res.body).to.have.lengthOf(4);
                // Validate each entity against IExpenseCategory interface
                validateExpenseSubCategories(res.body);
            });
            it("Then return '200 Success' and array of all card expense sub categories if type filter is 2", async function() {
                const res = await agent
                    .get(subCategoriesPath)
                    .query({ type: 2 })
                    .expect(200)
                    .expect("Content-Type", /json/);

                // Ensure the response is an array
                expect(res.body).to.be.an("array");
                // Ensure the length matches the amount of created cards
                expect(res.body).to.have.lengthOf(5);
                // Validate each entity against IExpenseCategory interface
                validateExpenseSubCategories(res.body);
            });
        });
    });
    // #endregion Sub Categories
    // #region GET Sub Category
    describe("When Fetching a Sub Category", function() {
        describe("Given an invalid id", function() {
            it("Then return '400 Bad Request Error' if sub category id has incorrect format", async function() {
                const id = "idIsNotANumber";
                const res = await agent
                    .get(`${subCategoriesPath}/${id}`)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Subcategory cannot be obtained because the provided id "${id}" was in an incorrect format.`);
            });
            it("Then return '404 Not Found Error' if sub category does not exist in user expense sub categories", async function() {
                const id = -1;
                const res = await agent
                    .get(`${subCategoriesPath}/${id}`)
                    .expect(404)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The requested resource could not be found.");
                expect(res.body).to.have.property("info", `Subcategory "${id}" cannot be obtained because it does not exist in user data.`);
            });
        });
        describe("Given a valid sub category id", function() {
            it("Then return '200 Success' and IExpenseSubCategory object", async function() {
                const res = await agent
                    .get(`${subCategoriesPath}/1`)
                    .expect(200)
                    .expect("Content-Type", /json/);
                // Validate entity against IExpenseSubCategory interface
                validateExpenseSubcategory(res.body);
            });
        });
    });
    // #endregion GET Sub Category
    // #region PUT Sub Category
    describe("When Updating a Sub Category", function() {
        describe("Given an invalid id", function() {
            it("Then return '400 Bad Request Error' if sub category id has incorrect format", async function() {
                const id = "idIsNotANumber";
                const res = await agent
                    .put(`${subCategoriesPath}/${id}`)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Subcategory cannot be updated because the provided id "${id}" was in an incorrect format.`);
            });
            it("Then return '404 Not Found Error' if sub category does not exist in user expense sub categories", async function() {
                const id = -1;
                const res = await agent
                    .put(`${subCategoriesPath}/${id}`)
                    .send({
                        name: "This should not be applied"
                    })
                    .expect(404)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The requested resource could not be found.");
                expect(res.body).to.have.property("info", `Subcategory "${id}" cannot be updated because it does not exist in user data.`);
            });
        });
        describe("Given an invalid payload", function() {
            it("Then return '400 Bad Request Error' if a malformed payload is used", async function() {
                const id = 1;
                const res = await agent
                    .put(`${subCategoriesPath}/${id}`)
                    .send({
                        incorrectProp1: "",
                        nonExistingProp: 2
                    })
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Subcategory "${id}" cannot be updated because a malformed payload was sent.`);
            });
            it("Then return '400 Bad Request Error' if user is trying to update a non real expense sub category", async function() {
                const id = 1;
                const res = await agent
                    .put(`${subCategoriesPath}/${id}`)
                    .send(payloads.ValidUpdate_ExpenseSubCategory_SimpleTest)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", `Subcategory "${id}" cannot be updated because non real expense type sub categories can not be modified.`);
            });
        });
        describe("Given a valid payload and id", function() {
            it("Then return '200 Success' and IExpenseSubCategory object if required payload parameters are sent", async function() {
                const res = await agent
                    .put(`${subCategoriesPath}/${lastCreatedId}`)
                    .send(payloads.ValidUpdate_ExpenseSubCategory_SimpleTest)
                    .expect(200)
                    .expect("Content-Type", /json/);
                // Validate entity against IExpenseCategory interface
                validateExpenseSubcategory(res.body);
                // validate updated attribute
                expect(res.body).to.have.property("name", payloads.ValidUpdate_ExpenseSubCategory_SimpleTest.name);
            });
        });
    });
    // #endregion PUT Sub Category
});
