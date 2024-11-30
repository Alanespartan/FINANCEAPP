import swaggerJSDoc from "swagger-jsdoc";

/** Swagger UI Options */
export const swaggerUIOptions = {
    explorer: true,
    swaggerOptions: {
        displayRequestDuration: true
    },
    customCss: ".operation-servers {display: none}"
};

/*
    By default swagger-jsdoc tries to parse all docs to it's best capabilities.
    If you'd like to you can instruct an Error to be thrown instead if validation
    failed by setting the options flag failOnErrors to true.
*/
/** Settings used to build a swagger instance using the server endpoints detailed with JSDoc.
 * @param apis Paths are relative to the file that imports this settings.
*/
const JSDocsOptions = {
    failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Express App Swagger API Docs",
            version: "0.1.0",
            description: "This is a list of all the available v1 routes in Express App documented with Swagger.",
            contact: {
                name: "Express App Team",
                email: "test@test.com",
            },
        }
    },
    apis: [
        // AUTH & API STUFF
        "./src/routes/v1/auth/*.ts",
        "./src/routes/v1/servers/*.ts",
        "./src/routes/v1/status/*.ts",

        // CARDS
        "./src/routes/v1/cards/*.ts",
        "../common/types/cards/*.ts",

        // USERS
        "../common/types/users/*.ts",

        // EXPENSES
        "./src/routes/v1/expenses/*.ts",
        "../common/types/expenses/*.ts",

        // OTHERS
        "../common/types/*.ts"
    ]
};

/** Settings used to build a swagger instance using the server endpoints detailed with JSDoc. */
export const swaggerDocumentFromJSDoc = swaggerJSDoc(JSDocsOptions);


// import componentsSettings from "./components";
/** Settings used to build a swagger instance using a JSON object rather than the server router endpoints. */
export const swaggerDocumentFromJsonOptions = {
    swagger: "2.0",
    info: {
        title: "",
        description: "",
        version: "1.0"
    },
    produces: [ "application/json" ],
    host: "localhost:8000",
    basePath: "/api/swagger/v1",
    paths: {
        "/api/v1/login": {
            post: {
                "x-swagger-router-controller": "middleware-name1",
                "operationId": "swagTest",
                "tags": [ "Auth" ],
                "description": "Stablish connection against ELM Servers and create Express App session.",
                "parameters": [],
                "responses": {}
            }
        }
    },
    // components: componentsSettings
};
