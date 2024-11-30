import { Router } from "express";
import { BadRequestError } from "@errors";
import { isValidExpenseTypeFilter, createExpenseType, getUserExpenseTypes } from "./functions";
import { OETypesOfExpense, CreateExpenseTypePayload } from "@common/types/expenses";
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

        // avoid creating a duplicate if a card with the given card number already exists
        if(user.expenseTypes.find((et) => et.name === options.name)) {
            throw new BadRequestError(`An expense type given "${options.name}" name already exists.`);
        }

        // create new expense type
        const newCardExpenseType = new ExpenseType(options, user.id);
        // save new expense type in db
        await createExpenseType(newCardExpenseType);

        // get updated data from db (otherwise we don't know the new expense type id)
        const data = await getUserExpenseTypes(user.id);
        // update cached data for future get operations
        user.expenseTypes = [];
        user.expenseTypes = data;

        // build response TODO EXPENSE TYPE fix this to be non null
        const toReturn = data.find((et) => et.name === options.name)!.toInterfaceObject(); // TODO EXPENSE TYPE create get method in user class for modularity

        return res.status(200).json(toReturn);
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
            throw new BadRequestError("Expense type filter was given in the incorrect format.");
        }

        // Verify given expense type is valid
        const filterBy = expenseType ? parseInt(expenseType) : OETypesOfExpense.ALL;
        if(!isValidExpenseTypeFilter(filterBy)) {
            throw new BadRequestError("Invalid type for filtering expense types.");
        }

        if(filterBy === OETypesOfExpense.ALL) {
            return res.status(200).json(user.expenseTypes);
        } else {
            return res.status(200).json(user.expenseTypes.filter((et) => et.type === filterBy));
        }
    } catch(error) { return next(error); }
});

export default router;
