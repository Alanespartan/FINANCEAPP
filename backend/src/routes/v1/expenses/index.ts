import { Router } from "express";
import { BadRequestError } from "@errors";
import { isValidExpenseTypeFilter } from "./functions";
import { OETypesOfExpense } from "@common/types/expenses";

const router = Router();

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
