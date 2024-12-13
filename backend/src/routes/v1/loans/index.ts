import { Router } from "express";
import {
    ConvertToUTCTimestamp,
    isValidPayFrequency,
    stringIsValidID
} from "@backend/utils/functions";
import { validateQueryParams } from "@backend/utils/requests";
import {
    saveExpenseCategory,
    saveExpenseSubCategory
} from "@entities/expenses/functions/db";
import {
    CreateExpenseSubCategoryPayload,
    OETypesOfExpense
} from "@common/types/expenses";
import { getBank  } from "@entities/cards/functions/db";
import { saveLoan } from "@entities/loans/functions/db";
import { verifyCreateLoanBody }     from "@entities/loans/functions/util";
import { Loan, ExpenseSubCategory } from "@entities";
import { BadRequestError, NotFoundError } from "@errors";

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
        if(user.hasLoan(options.name, "name")) {
            throw new BadRequestError(`Loan "${options.name}" cannot be created because one with that name already exists.`);
        }

        // validate loan expiration date is correct
        if(options.expires) {
            // using UTC function for correct timestamp comparision
            if(ConvertToUTCTimestamp(options.expires) < ConvertToUTCTimestamp(new Date())) {
                throw new BadRequestError(`Loan "${options.name}" cannot be created because expiration date "${options.expires}" can't be less than today's date.`);
            }
        }

        // save new loan in db
        const newLoan = new Loan(options, user.id);
        const savedLoan = await saveLoan(newLoan);

        // get loans default parent expense category
        let loansCategory = user.getExpenseCategoryByName("Loans");

        // create new expense sub category using loan info so we can register when paying "TO THIS LOAN"
        const toSaveSubCategory = new ExpenseSubCategory(
            {
                name: savedLoan.name,
                type: OETypesOfExpense.LOAN,
                instrumentId: savedLoan.id
            } as CreateExpenseSubCategoryPayload, user.id
        );
        // save new loan sub category
        const savedLoansSubCategory = await saveExpenseSubCategory(toSaveSubCategory);

        // add saved loan sub category into "Loans" category
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

// #region GET Loans
/**
* @swagger
* /api/v1/loans:
*   get:
*       summary: Get user loans
*       description: Get all loans a user has registered.
*       tags:
*           - Loans
*       parameters:
*           - in: query
*             name: archived
*             schema:
*               type: boolean
*           - in: query
*             name: isFinished
*             schema:
*               type: boolean
*           - in: query
*             name: payFrequency
*             schema:
*               $ref: "#/components/schemas/TPayFrequency"
*       responses:
*           200:
*               description: An array of loans a user has registered.
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: "#/components/schemas/ILoan"
*           400:
*               description: Bad Request Error
*/
router.get("/", async (req, res, next) => {
    try {
        const user     = req.userData;
        // optional filters
        const { archived, isFinished, payFrequency } = req.query;

        // Validate query parameters
        const archivedFilter     = validateQueryParams(archived,     "boolean", "archived");
        const isFinishedFilter   = validateQueryParams(isFinished,   "boolean", "isFinished");
        const payFrequencyFilter = validateQueryParams(payFrequency, "number",  "payFrequency");

        // Apply filters
        let loans = user.getLoans();
        if(archivedFilter !== undefined) {
            loans = loans.filter((loan) => loan.archived === archivedFilter);
        }
        if(isFinishedFilter !== undefined) {
            loans = loans.filter((loan) => loan.isFinished === isFinishedFilter);
        }
        if(payFrequencyFilter !== undefined) {
            if(payFrequencyFilter && !isValidPayFrequency(payFrequencyFilter as number)) {
                throw new BadRequestError("Invalid payFrequency value.");
            }
            loans = loans.filter((loan) => loan.payFrequency === payFrequencyFilter);
        }

        return res.status(200).json(loans);
    } catch(error) { return next(error); }
});
// #endregion GET Loans

// #region GET Loan
/**
* @swagger
* /api/v1/loans/{id}:
*   get:
*       summary: Fetch loan
*       description: Get desired loan from user data using an id.
*       tags:
*           - Loans
*       parameters:
*           - in: path
*             name: id
*             schema:
*               type: integer
*       responses:
*           200:
*               description: A JSON representation of the desired loan.
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/ILoan"
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
            throw new BadRequestError(`Loan cannot be obtained because the provided id "${id}" was in an incorrect format.`);
        }

        // validate a loan with the given id exists
        const parsedId = Number(id);
        if(!user.hasLoan(parsedId, "id")) {
            throw new NotFoundError(`Loan "${parsedId}" cannot be obtained because it does not exist in user data.`);
        }

        return res.status(200).json(user.getLoanById(parsedId).toInterfaceObject());
    } catch(error) { return next(error); }
});
// #endregion GET Loan

export default router;
