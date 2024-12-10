import { Router } from "express";
import { BadRequestError, NotFoundError } from "@errors";
import { saveExpenseCategory } from "@entities/expenses/functions/db";
import { verifyCreateExpenseCategoryBody } from "@entities/expenses/functions/util";
import { UpdateExpenseCategoryPayload } from "@common/types/expenses";
import { ExpenseCategory } from "@entities";
import { stringIsValidID } from "@backend/utils/functions";

const router = Router();

// #region POST Category
/**
* @swagger
* /api/v1/expenses/categories:
*   post:
*       summary: New expense category
*       description: Create and assign a new expense category.
*       tags:
*           - Expenses
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: "#/components/schemas/CreateExpenseCategoryPayload"
*       responses:
*           201:
*               description: A JSON representation of the created expense category.
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/IExpenseCategory"
*           400:
*               description: Bad Request Error
*/
router.post("/", async (req, res, next) => {
    try {
        const user    = req.userData;
        const options = req.body;

        if(!verifyCreateExpenseCategoryBody(options)) {
            throw new BadRequestError("New category cannot be created because a malformed payload was sent.");
        }

        // avoid creating a default category because these are created during user sign up
        if(options.isDefault) {
            throw new BadRequestError(`Category "${options.name}" cannot be created because user is not allowed to create a default category.`);
        }

        // avoid creating a duplicate
        if(user.hasExpenseCategory(options.name, "name")) {
            throw new BadRequestError(`Category "${options.name}" cannot be created because one with that name already exists.`);
        }

        // save new expense category in db
        const savedCategory = await saveExpenseCategory(new ExpenseCategory(options, user.id));

        // update the in-memory array for future operations
        user.addExpenseCategory(savedCategory);

        return res.status(201).json(savedCategory.toInterfaceObject());
    } catch(error) { return next(error); }
});
// #endregion POST Category

// #region GET Categories
/**
* @swagger
* /api/v1/expenses/categories:
*   get:
*       summary: Fetch expense categories
*       description: Get all expense categories a user has registered.
*       tags:
*           - Expenses
*       parameters:
*           - in: query
*             name: onlyDefault
*             schema:
*               type: string
*       responses:
*           200:
*               description: An array of expense categories a user has registered.
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: "#/components/schemas/IExpenseCategory"
*           400:
*               description: Bad Request Error
*/
router.get("/", async (req, res, next) => {
    try {
        const user = req.userData;
        const onlyDefault = req.query.onlyDefault; // by default is always "FALSE" so ALL categories are fetched (if not modified by user in the front end)

        if(onlyDefault) {
            if(typeof onlyDefault !== "string") {
                throw new BadRequestError("Categories cannot be obtained because the onlyDefault filter provided was in an incorrect format.");
            }
            if(!(onlyDefault === "true" || onlyDefault === "false")) {
                throw new BadRequestError(`Categories cannot be obtained because an incorrect onlyDefault filter was used in the request: ${onlyDefault}.`);
            }
            if((/true/).test(onlyDefault)) {
                return res.status(200).json(user.getExpenseCategories().filter((ec) => ec.isDefault));
            } else {
                return res.status(200).json(user.getExpenseCategories().filter((ec) => !ec.isDefault));
            }
        }

        return res.status(200).json(user.getExpenseCategories());
    } catch(error) { return next(error); }
});
// #endregion GET Categories

// #region GET Category
/**
* @swagger
* /api/v1/expenses/categories/{id}:
*   get:
*       summary: Fetch expense category
*       description: Get desired expense category from user data using an id.
*       tags:
*           - Expenses
*       parameters:
*           - in: path
*             name: id
*             schema:
*               type: integer
*       responses:
*           200:
*               description: A JSON representation of the desired expense category.
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: "#/components/schemas/IExpenseCategory"
*           400:
*               description: Bad Request Error
*           404:
*               description: Not Found Error
*/
router.get("/:id", async (req, res, next) => {
    try {
        const user = req.userData;
        const id   = req.params.id;

        // check if given id is in correct form
        if(!stringIsValidID(id)) {
            throw new BadRequestError(`Category cannot be obtained because the provided id "${id}" was in an incorrect format.`);
        }

        // validate a expense category with the given id exists
        const parsedId = Number(id);
        if(!user.hasExpenseCategory(parsedId, "id")) {
            throw new NotFoundError(`Category "${parsedId}" cannot be obtained because it does not exist in user data.`);
        }

        return res.status(200).json(user.getExpenseCategoryById(parsedId));
    } catch(error) { return next(error); }
});
// #endregion GET Category

// #region PUT Category
/**
* @swagger
* /api/v1/expenses/categories/{id}:
*   put:
*       summary: Update expense category
*       description: From a given expense category id, fetch the desired expense category and apply all the updates that appear in the payload configuration.
*       tags:
*           - Expenses
*       parameters:
*           - in: path
*             name: id
*             schema:
*               type: string
*               description: The id of the desired expense category to update.
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: "#/components/schemas/UpdateExpenseCategoryPayload"
*       responses:
*           200:
*               description: A JSON representation of the updated expense category.
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/IExpenseCategory"
*           404:
*               description: Not Found Error
*/
router.put("/:id", async (req, res, next) => {
    try {
        const user    = req.userData;
        const options = req.body as UpdateExpenseCategoryPayload;
        const id      = req.params.id;

        // check if given id is in correct form
        if(!stringIsValidID(id)) {
            throw new BadRequestError(`Category cannot be updated because the provided id "${id}" was in an incorrect format.`);
        }

        // validate a expense category with the given id exists
        const parsedId = Number(id);
        if(!user.hasExpenseCategory(parsedId, "id")) {
            throw new NotFoundError(`Category "${parsedId}" cannot be updated because it does not exist in user data.`);
        }

        // check if user is trying to update a default category
        if(user.getExpenseCategoryById(parsedId).isDefault) {
            throw new BadRequestError(`Category "${parsedId}" cannot be updated because it is an app default category.`);
        }

        // update the in-memory object properties directly for future operations
        const toUpdate = user.setOptionsIntoExpenseCategory(parsedId, options);
        // apply expense type changes in db using updated object
        const savedExpenseCategory = await saveExpenseCategory(toUpdate);

        //const inMemoryCategory = user.getExpenseCategoryById(parsedId);
        //Object.assign(inMemoryCategory, savedExpenseCategory);

        return res.status(200).json(savedExpenseCategory.toInterfaceObject());
    } catch(error) { return next(error); }
});
// #endregion PUT Category

export default router;
