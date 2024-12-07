import { Router } from "express";
import { BadRequestError, NotFoundError } from "@errors";
import { saveExpenseCategory } from "@entities/expenses/functions/db";
import { CreateExpenseCategoryPayload, UpdateExpenseCategoryPayload } from "@common/types/expenses";
import { ExpenseCategory } from "@entities";

const router = Router();

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
*               description: A JSON representation of the recently created expense category.
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
        const options = req.body as CreateExpenseCategoryPayload;

        // avoid creating a duplicate if an expense type with the given name already exists
        if(user.hasExpenseCategory(options.name, "name")) {
            throw new BadRequestError(`An expense type with the given "${options.name}" name already exists.`);
        }

        // save new expense type in db
        const savedExpenseCategory = await saveExpenseCategory(new ExpenseCategory(options, user.id));

        // update cached data for future get operations
        user.addExpenseCategory(savedExpenseCategory);

        return res.status(201).json(savedExpenseCategory.toInterfaceObject());
    } catch(error) { return next(error); }
});

/**
* @swagger
* /api/v1/expenses/categories:
*   get:
*       summary: Fetch expense categories
*       description: Get all expense categories a user has registered.
*       tags:
*           - Expenses
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

        return res.status(200).json(user.getExpenseCategories());
    } catch(error) { return next(error); }
});

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
*           description: Payload that includes all the desired updates.
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

        // validate a expense type with the given id exists to be updated
        const parsedId = parseInt(id);
        if(!user.hasExpenseCategory(parsedId, "id")) {
            throw new NotFoundError(`There is no expense category to update with id: ${parsedId}.`);
        }

        // update cached expense type data
        const toUpdate = user.setOptionsIntoExpenseCategory(parsedId, options);
        // apply expense type changes in db using updated object
        const savedExpenseCategory = await saveExpenseCategory(toUpdate);

        // TODO CATEGORY validate this works
        let inMemoryCategory = user.getExpenseCategoryById(parsedId);
        inMemoryCategory = savedExpenseCategory;
        console.log(inMemoryCategory);

        return res.status(200).json(savedExpenseCategory.toInterfaceObject());
    } catch(error) { return next(error); }
});

export default router;
