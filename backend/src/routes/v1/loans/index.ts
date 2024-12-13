import { Router } from "express";
import { BadRequestError } from "@errors";
import { ConvertToUTCTimestamp } from "@backend/utils/functions";
import { Loan, ExpenseSubCategory } from "@entities";
import { verifyCreateLoanBody } from "@entities/loans/functions/util";
import { getBank } from "@entities/cards/functions/db";
import { saveLoan } from "@entities/loans/functions/db";
import { saveExpenseCategory, saveExpenseSubCategory } from "@entities/expenses/functions/db";
import { CreateExpenseSubCategoryPayload, OETypesOfExpense } from "@common/types/expenses";

const router = Router();

// #region POST Loan
/**
* @swagger
* /api/v1/loans:
*   post:
*       summary: New loan
*       description: Create and save a new loan
*       tags:
*           - Loans
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: "#/components/schemas/CreateLoanPayload"
*       responses:
*           201:
*               description: A JSON representation of the created loan.
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/ILoan"
*           400:
*               description: Bad Request Error
*/
router.post("/", async (req, res, next) => {
    try {
        const user     = req.userData;
        const options  = req.body;

        if(!verifyCreateLoanBody(options)) {
            throw new BadRequestError("New loan cannot be created because a malformed payload was sent.");
        }

        if( !(await getBank(options.bankId)) ) {
            throw new BadRequestError(`Loan "${options.name}" cannot be created because an incorrect bank id was used in the request: ${options.bankId}.`);
        }

        // avoid creating a duplicate if a loan with the given loan number already exists
        if(user.hasLoan(options.name)) {
            throw new BadRequestError(`Loan "${options.name}" cannot be created because one with that name already exists.`);
        }

        /* LOAN EXPIRATION DATE */
        if(options.expires) {
            // using UTC function for correct timestamp comparision
            if(ConvertToUTCTimestamp(options.expires) < ConvertToUTCTimestamp(new Date())) {
                throw new BadRequestError(`Loan "${options.name}" cannot be created because expiration date "${options.expires}" can't be less than today's date.`);
            }
        }

        const newLoan = new Loan(options, user.id);

        // save new loan in db
        const savedLoan = await saveLoan(newLoan);

        // get loans default parent expense category
        let loansCategory = user.getExpenseCategoryByName("Loans");

        // create new expense sub category using loan info so we can register when paying "TO THIS CARD"
        const toSaveSubCategory = new ExpenseSubCategory(
            {
                name: savedLoan.name,
                type: OETypesOfExpense.LOAN,
                instrumentId: savedLoan.id
            } as CreateExpenseSubCategoryPayload, user.id
        );
        // save updated loans category which is the owner of the relationship (it has JoinColumn decorator and cascade) and has the new sub category
        const savedLoansSubCategory = await saveExpenseSubCategory(toSaveSubCategory);

        // add sub category into "Loans" category
        loansCategory.addSubCategory(savedLoansSubCategory);

        // add relationship between loans category and new sub category into many to many table
        const savedLoansCategory = await saveExpenseCategory(loansCategory);

        // update cached data for future get operations
        user.addLoan(savedLoan);
        user.addExpenseSubCategory(savedLoansSubCategory); // use saved sub category loan object
        loansCategory = savedLoansCategory; // replace existing ref in memory value with returned object from query

        return res.status(201).json(savedLoan.toInterfaceObject());
    } catch(error) { return next(error); }
});
// #endregion POST Loan

export default router;
