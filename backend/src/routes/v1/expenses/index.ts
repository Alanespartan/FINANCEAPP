import { Router } from "express";
import { BadRequestError } from "@errors";
import { isValidExpenseType } from "./functions";
import { User } from "@entities";

const router = Router();

/**
* @swagger
* /api/v1/expenses:
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
router.get("/", async (req, res, next) => {
    try {
        const user: User = req.userData;
        const expenseType = req.query.expenseType; // by default is always "ALL" (if not modified by user in the front end)

        if(expenseType && typeof expenseType !== "string") {
            throw new BadRequestError("Expense type filter was given in the incorrect format.");
        }

        // Verify given expense type is valid
        const filterBy = expenseType ? parseInt(expenseType) : undefined;
        if(filterBy && !isValidExpenseType(filterBy)) {
            throw new BadRequestError("Invalid type for filtering cards.");
        }

        if(filterBy) {
            return res.status(200).json(user.cards.filter((card) => card.type === filterBy));
        } else {
            return res.status(200).json(user.cards);
        }
    } catch(error) { return next(error); }
});

export default router;
