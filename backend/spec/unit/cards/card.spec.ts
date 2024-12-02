import supertest from "supertest";
import { expect } from "chai";

// Initialize a Supertest agent and other required variables
// This creates an agent that persists cookies and headers across all requests made by the agent.
// All tests use the same agent, maintaining the session between requests and eliminating the need
// to re-authenticate for each request.
const server   = "http://localhost:3000";
const agent    = supertest.agent(server);
const version  = "v1";
const authPath = `/api/${version}`;
const cardPath = `/api/${version}/cards`;

// Log in before all tests and set the session
before(async () => {
    const credentials = {
        email:    process.env.TEST_USER as string,
        password: process.env.TEST_PASSWORD as string
    };

    // login to store connection in server
    const res = await agent.post(`${authPath}/login`).send(credentials);
    if(res.status !== 200) { throw new Error(`Login failed: ${res.body.info}`); }
});

// Logout after all tests
after(async () => {
    const res = await agent.post(`${authPath}/logout`);
    if(res.status !== 200) { throw new Error("Logout failed!"); }
});

describe(`Testing API: ${cardPath}`, function() {
    // #region Create Card Tests
    describe("When Creating a Card", function() {
        describe("Given invalid headers", function() {
            it("Must throw a 400 Bad Request Error if 'cardType' header is missing", async function() {
                const res = await agent
                    .post(cardPath)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "Expected 'cardType' header was not provided.");
            });
            it("Must throw a 400 Bad Request Error if an invalid type is used", async function() {
                const res = await agent
                    .set("cardType", "-1")
                    .post(cardPath)
                    .expect(400)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "The server did not understand the request or could not read the request body.");
                expect(res.body).to.have.property("info", "Invalid type for creating a new card.");
            });
        });
        describe("Given invalid payload", function() {
            const invalidCardNumber = {
                cardNumber: "482069a7378b92153z1",
                expires:    new Date(),
                bankId:     1,
                balance:    10000,
                name:       "Visa Débito BBVA Nómina",
                limit:      10000,
                isVoucher:  false
            };
            it("Must throw a 500 Server Error if a malformed payload is used", async function() {
                const res = await agent
                    .set("cardType", "1")
                    .post(cardPath)
                    .send({
                        incorrectProp1: "",
                        nonExistingProp: 2
                    })
                    .expect(500)
                    .expect("Content-Type", /json/);
                expect(res.body).to.have.property("status", "error");
                expect(res.body).to.have.property("message", "A typescript error occurred while trying to process your request.");
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
                expect(res.body).to.have.property("info", "Invalid card number \"482069a7378b92153z1\". A card number can not contain non numeric chars.");
            });
        });
    });
    // #endregion Create Card Tests

    // #region Fetch Card Tests
    // #endregion Fetch Card Tests
});
