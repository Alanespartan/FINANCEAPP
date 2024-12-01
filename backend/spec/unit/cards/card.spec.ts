import supertest from "supertest";
import { expect } from "chai";
import app from "../../../src/app";

// Initialize a Supertest agent and other required variables
// This creates an agent that persists cookies and headers across all requests made by the agent.
// All tests use the same agent, maintaining the session between requests and eliminating the need
// to re-authenticate for each request.
const agent    = supertest.agent(app);
const version  = "v1";
const authPath = `/api/${version}`;
const cardPath = `/api/${version}/cards`;

// Log in before all tests and set the session
before(async () => {
    // TODO TESTING fix this so takes values from .env "process.env.TEST_USER" and "process.env.TEST_PASSWORD"
    const credentials = {
        email:    "test@gmail.com",
        password: "admin"
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


describe("API Cards Tests", function() {
    describe("Create Card", function() {
        describe("Missing cardType header", function() {
            it("Should throw 400 Bad Request Error", async function() {
                const res = await agent
                    .post(cardPath)
                    .expect(400)
                    .expect("Content-Type", /json/);

                expect(res.body.status).to.have.property("status", "error");
                expect(res.body.message).to.have.property("status", "The server did not understand the request or could not read the request body.");
                expect(res.body.info).to.have.property("message", "Expected 'cardType' header was not provided.");
            });
        });
    });
});
