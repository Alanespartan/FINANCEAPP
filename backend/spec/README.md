<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- GETTING STARTED -->
# Getting Started
This page contains the necessary knowledge to sucessfully test the project backend express server.

## Types of Tests
In the project, as development evolves, we need to fully implement the following type of tests for each feature implemented.

### Unit tests
Unit tests are very low level and close to the source of an application. They consist in testing individual methods and functions of the classes, components, or modules used by your software. Unit tests are generally quite cheap to automate and can run very quickly by a continuous integration server.

### Integration tests
Integration tests verify that different modules or services used by your application work well together. For example, it can be testing the interaction with the database or making sure that microservices work together as expected. These types of tests are more expensive to run as they require multiple parts of the application to be up and running.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Prerequisites
Follow instructions written in [backend](https://github.com/Alanespartan/FINANCEAPP/tree/main/backend), but please ensure to follow the instructions below too.

### Environment Variables
In the root of the project, there is an `env.example` file that contains all the necessary environment variables you need to add into your own `.env` file, among these the following ones are used for testing

```
TEST_EMAIL=test@gmail.com
TEST_PASSWORD=admin
TEST_FIRST_NAME=Arturo
TEST_LAST_NAME=Cruz
```
Note: The `LOG_LEVEL` variable also impacts the behavior of `TypeORM`, if you want to include the SQL logs into the terminal, set it as `trace`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Node Modules
Verify the following node modules are installed when running the `backend` instructions, otherwise you can install these manually as shown below.

* [Supertest](https://www.npmjs.com/package/supertest) supports chaining .expect() for status codes, headers, and response bodies during execution of tests. It also provides the capability to create a custom http agent that allows us to maintain cookies and headers across multiple requests, effectively simulating a persistent session throughout all tests.

    ```sh
    npm install supertest@7.0.0
    npm install @types/supertest@6.0.2
    ```
* [Chai](https://www.npmjs.com/package/chai) provides powerful matching for more complex conditions, making it useful for tests scenarios involving deep object comparison or custom assertions.

    ```sh
    npm install chai@4.5.0
    npm install @types/chai@4.3.20
    ```
* [Mocha](https://www.npmjs.com/package/mocha) help us to make asynchronous tests, by running these serially, allowing for flexible and accurate reporting. It also provides provides hooks (before, after, etc.) to handle requests or db management to support our tests.

    ```sh
    npm install mocha@9.2.2
    npm install @types/mocha@9.1.1
    ```
* [Concurrently](https://www.npmjs.com/package/concurrently) and [wait-on](https://www.npmjs.com/package/wait-on) are used to to run both the server and tests simultaneously.
  
    ```sh
    npm install concurrently@9.1.0
    npm install wait-on@8.0.1
    ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

### Naming Convention

To ensure your tests follow a proper naming convention and are easy to understand, you can structure them based on the Given-When-Then pattern. This naming convention helps clarify the context, action, and expected outcome of the test. Also, by following this pattern, the tests clarity is improved and is easy to trace what each test is doing and its expected result.

Below are some phrase examples for tests:

- When Creating a X_Given Valid Payload_Then must return a 201 Created
- When Fetching Y objects_Given X Filter_Then must return a 200 Success

Test are written to focus on the context (whay API), the action (what is happening), the state (headers/payload), and the result (what is expected). Remember, by breaking down the tests into smaller contexts, it becomes more readable and structured.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### How to run the tests
#### Option 1
1. Open a new terminal and run the server locally

   ```sh
   node .
   ```

2. Open an extra terminal, and run the tests

   ```sh
   npm run test
   ```

   ![image](https://github.com/user-attachments/assets/ab3115cb-3a9b-4165-8dbc-27abf9236b70)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Option 2

1. Open a new terminal and run both the server and tests simultaneously

   ```sh
   npm run start:test
   ```
   ![image](https://github.com/user-attachments/assets/07155efc-638a-40eb-b5dc-dea974f88186)
   ![image](https://github.com/user-attachments/assets/70a4159d-8b8e-443f-b054-a20953a757bd)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
