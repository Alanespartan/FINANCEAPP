/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";
// import { DefaultCategories } from "../../../../common/types/expenses";
import { agent, version } from "../../setup";

const categoriesPath = `/api/${version}/expenses/categories`;

describe(`Testing API: ${categoriesPath}`, function() {
    // #region Fetch Cards Tests
    describe("When Fetching Categories", function() {
        describe("Given no filter", function() {
            it("Then return '200 Success' and array of all created categories", async function() {
                const res = await agent
                    .get(categoriesPath)
                    .expect(200)
                    .expect("Content-Type", /json/);

                // Ensure the response is an array
                expect(res.body).to.be.an("array");

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
    });
    // #endregion Fetch Cards Tests
});
