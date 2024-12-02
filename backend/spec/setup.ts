import supertest from "supertest";
import path from "path";
import * as dotenv from "dotenv";

// Load .env in Test Setup Code
dotenv.config({
    path: path.resolve(__dirname, "..", "..", ".env")
});

// Initialize a Supertest agent and other required variables
// This creates an agent that persists cookies and headers across all requests made by the agent.
// All tests use the same agent, maintaining the session between requests and eliminating the need
// to re-authenticate for each request.
const server   = "http://localhost:3000";
export const agent    = supertest.agent(server);
export const version  = "v1";

const authPath = `/api/${version}`;

const email     = process.env.TEST_EMAIL;
const password  = process.env.TEST_PASSWORD;
const firstName = process.env.TEST_FIRST_NAME;
const lastName  = process.env.TEST_LAST_NAME;

if(!email)     throw new Error("Must provide a email environment variable");
if(!password)  throw new Error("Must provide a password environment variable");
if(!firstName) throw new Error("Must provide a firstName environment variable");
if(!lastName)  throw new Error("Must provide a lastName environment variable");

// Create account and log in before all tests are executed
before(async () => {
    const testUser = {
        email,
        password,
        firstName,
        lastName
    };
    const credentials = {
        email,
        password
    };

    // create account in server
    const signUp = await agent.post(`${authPath}/signup`).send(testUser);
    if(signUp.status !== 201) { throw new Error(`Sign up failed: ${signUp.body.info}`); }

    // login to store connection in server
    const login = await agent.post(`${authPath}/login`).send(credentials);
    if(login.status !== 200) { throw new Error(`Login failed: ${login.body.info}`); }
});

// Logout after all tests
after(async () => {
    const res = await agent.post(`${authPath}/logout`);
    if(res.status !== 200) { throw new Error("Logout failed!"); }
});
