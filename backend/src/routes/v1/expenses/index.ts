import { Router } from "express";
import { BadRequestError, NotFoundError } from "@errors";
import { saveExpenseType } from "@entities/expenses/functions/db";
import { isValidExpenseTypeFilter } from "@entities/expenses/functions/util";
import { OETypesOfExpense, CreateExpenseTypePayload, UpdateExpenseTypePayload } from "@common/types/expenses";
import { ExpenseType } from "@entities";

const router = Router();

/**
* @swagger
* /api/v1/expenses/types:
*   post:
*       summary: Create a new expense type
*       description: Create and assign a new expense type (real expense) to the user
*       tags:
*           - Expenses
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: "#/components/schemas/CreateExpenseTypePayload"
*       responses:
*           200:
*               description: A JSON representation of the recently created expense type.
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/IExpenseType"
*           400:
*               description: Bad Request Error
*/
router.post("/", async (req, res, next) => {
    try {
        const user    = req.userData;
        const options = req.body as CreateExpenseTypePayload;

        // other types are created when their respective create (card/loan/account) POST endpoint is executed
        if(options.type !== OETypesOfExpense.REALEXPENSE) {
            throw new BadRequestError(`Invalid type (${options.type})for creating a new expense type.`);
        }

        // avoid creating a duplicate if an expense type with the given name already exists
        if(user.expenseTypes.find((et) => et.name === options.name)) {
            throw new BadRequestError(`An expense type with the given "${options.name}" name already exists.`);
        }

        // save new expense type in db
        const savedExpenseType = await saveExpenseType(new ExpenseType(options, user.id));

        // update cached data for future get operations
        user.addExpenseType(savedExpenseType);

        return res.status(200).json(savedExpenseType.toInterfaceObject());
    } catch(error) { return next(error); }
});

/**
* @swagger
* /api/v1/expenses/types:
*   get:
*       summary: Get user expense types
*       description: Get all expense types a user has registered.
*       tags:
*           - Expenses
*       parameters:
*           - in: query
*             name: expenseType
*             schema:
*               type: integer
*       responses:
*           200:
*               description: An array of expense types a user has registered.
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: "#/components/schemas/IExpenseType"
*           400:
*               description: Bad Request Error
*/
router.get("/types", async (req, res, next) => {
    try {
        const user = req.userData;
        const expenseType = req.query.expenseType; // by default is always "ALL" (if not modified by user in the front end)

        if(expenseType && typeof expenseType !== "string") {
            throw new BadRequestError("No expense type filter was given in the correct format.");
        }

        // If no expenseType given, default is to get all
        const filterBy = expenseType ? parseInt(expenseType) : OETypesOfExpense.ALL;
        // Verify given expense type is valid
        if(!isValidExpenseTypeFilter(filterBy)) {
            throw new BadRequestError("Invalid type for filtering expense types.");
        }

        return res.status(200).json(user.getExpenseTypes(filterBy));
    } catch(error) { return next(error); }
});

/**
* @swagger
* /api/v1/expenses/types/{id}:
*   put:
*       summary: Update user expense type
*       description: From a given expense type id, fetch the desired expense type and apply all the updates that appear in the payload configuration.
*       tags:
*           - Expenses
*       parameters:
*           - in: path
*             name: id
*             schema:
*               type: string
*               description: The id of the desired expense type to update.
*       requestBody:
*           description: Payload that includes all the desired updates.
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: "#/components/schemas/UpdateExpenseTypePayload"
*       responses:
*           200:
*               description: A JSON representation of the updated expense type.
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/IExpenseType"
*           400:
*               description: Bad Request Error
*           404:
*               description: Not Found Error
*/
router.put("/:id", async (req, res, next) => {
    try {
        const user    = req.userData;
        const options = req.body as UpdateExpenseTypePayload;
        const id      = req.params.id;

        // validate a expense type with the given id exists to be updated
        const parsedId = parseInt(id);
        if(!user.hasExpenseType(parsedId, "id")) {
            throw new NotFoundError(`There is no expense type to update with id: ${parsedId}.`);
        }

        // update cached expense type data
        const toUpdate = user.setOptionsIntoExpenseType(parsedId, options);
        // apply expense type changes in db using updated object
        const savedExpenseType = await saveExpenseType(toUpdate);

        return res.status(200).json(savedExpenseType.toInterfaceObject());
    } catch(error) { return next(error); }
});

export default router;
