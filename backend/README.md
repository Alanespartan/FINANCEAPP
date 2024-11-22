<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- GETTING STARTED -->
## Getting Started
To sucessfully run the backend express server in your local follow these simple example steps.

### Installation
Is recommended to open the `backend` folder in visual studio window, so the extensions are loaded correctly to provide a better development experience.

1. Open a new terminal
2. Install NPM packages
   
   ```sh
   npm install
   ```

3. Build the project
   
   ```sh
   npm run build
   ```

### Usage

1. Run the server locally

   ```sh
   node .
   ```

2. Open a new tab in your browser and access `localhost:3000/`

Note: This will only runs the server, if the frontend project is not built, then you can't access the login page nor the home page.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Swagger
[Swagger](https://swagger.io/docs/specification/v3_0/about/) is a set of open-source tools built around the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md) that can help you design, build, document, and consume REST APIs.

*SpendSense* development can be done way faster if we are able to document our endpoints successfully, so we can test our features without the need of a user interface. 

To access the Swagger UI, you need to run the project as indicated in the previous usage section, then log in normally and once you are redirected to the home page, open a new tab using `localhost:3000/api-docs/`.

![image](https://github.com/user-attachments/assets/6ea2ae6e-2e3b-4210-ad33-29974698972f)

#### How to Use
This is a basic example you can copy to write other swagger summaries and schemas, but is highly recommended to read the [Swagger](https://swagger.io/docs/specification/v3_0/about/) documentation and read the other existing examples in our code base.

```js
/**
* @swagger
* components:
*   schemas:
*       YourSchema:
*           type: object
*           properties:
*               propertyOne:
*                   type: number
*                   description: An example description
*                   example: 4815
*               propertyTwo:
*                   type: boolean
*                   example: false
*               propertyThree:
*                   type: string
*                   format: date
*                   example: 2029-04-01
* /api/v1/endpointPath:
*   get:
*       summary: Endpoint Name
*       description: Endpoint Description
*       tags:
*           - MyTag (By using the same tag in different endpoints, you can group these)
*       parameters:
*           - in: query
*             name: queryParam1
*             schema:
*               type: integer
*       responses:
*           200:
*               description: A JSON payload object example
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: "#/components/schemas/YourSchema"
*           400:
*               description: Bad Request Error
*           OtherHTTPResponseCode:
*               description: Response Error Name
*/
router.get("/", (req, res, next) => {
    try {
        // your endpoint logic here
    } catch(error) { return next(error); }
});
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Error Handler
In the `app.ts` file we have the following line to allow our Express Server to invoke our custom middleware whenever an error occurs during a request-response cycle. Be aware of the fact that our custom middleware is declared in the `src/middlware/errorHandler.ts` file.

```js
app.use(errorHandler);
```

For every router endpoint we write, a try/catch block is needed to propagates all thrown errors to the global error handler thru the `next` function call.
```js
router.get("/", (req, res, next) => {
    try {
        // your endpoint logic here
    } catch(error) { return next(error); }
});
```

Read more [here](https://mirzaleka.medium.com/build-a-global-exception-handler-using-express-js-typescript-b9bb2f521e5e).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Middleware

TODO complete this section once we successfully implement a connection to the DB and the routers middlware verifies the connection.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
