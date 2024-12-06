import { Router } from "express";
import { BadRequestError } from "@errors";
import { saveExpenseType } from "@entities/expenses/functions/db";
import { isValidExpenseTypeFilter } from "@entities/expenses/functions/util";
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

        // avoid creating a duplicate if an expense type with the given name already exists
        if(user.expenseTypes.find((et) => et.name === options.name)) {
            throw new BadRequestError(`An expense type with the given "${options.name}" name already exists.`);
        }

        // save new card in db
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

export default router;
