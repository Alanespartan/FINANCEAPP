/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";
import { agent, version } from "../../setup";
import { validateSubcategory } from "./functions";
import * as payloads from "./payloads";

const subCategoriesPath = `/api/${version}/expenses/subcategories`;

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
                validateSubcategory(res.body);

                // Check required properties and types
                expect(res.body).to.have.property("type", payloads.ValidCreation_ExpenseSubCategory_SimpleTest.type);
                expect(res.body).to.have.property("name", payloads.ValidCreation_ExpenseSubCategory_SimpleTest.name);
            });
            it("Then return '201 Created' and IExpenseCategory object if multiple sub categories are created successfully", async function() {
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
                    validateSubcategory(response.body);

                    // Check required properties and types
                    expect(response.body).to.have.property("type", payloads.ValidCreation_ExpenseSubCategory_MultipleDummy[index].type);
                    expect(response.body).to.have.property("name", payloads.ValidCreation_ExpenseSubCategory_MultipleDummy[index].name);
                });
            });
        });
    });
});
