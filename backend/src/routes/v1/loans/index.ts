import { Router } from "express";
import {
    isValidPayFrequency,
    stringIsValidID
} from "@backend/utils/functions";
import { validateQueryParams } from "@backend/utils/requests";
import {
    saveExpenseCategory,
    saveExpenseSubCategory
} from "@entities/expenses/functions/db";
import { getBank } from "@entities/banks/functions/db";
import {
    CreateExpenseSubCategoryPayload,
    OETypesOfExpense
} from "@common/types/expenses";
import { saveLoan } from "@entities/loans/functions/db";
import { RunPayloadsParamsChecks, VerifyCreateLoanBody, VerifyUpdateLoanBody } from "@entities/loans/functions/util";
import { Loan, ExpenseSubCategory } from "@entities";
import { BadRequestError, NotFoundError, ServerError } from "@errors";

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
        const user    = req.userData;
        const options = req.body;

        // check payload is in correct form
        if(!VerifyCreateLoanBody(options)) {
            throw new BadRequestError("New loan cannot be created because a malformed payload was sent.");
        }

        if( !(await getBank(options.bankId)) ) {
            throw new BadRequestError(`Loan "${options.name}" cannot be created because an incorrect bank id was used in the request: ${options.bankId}.`);
        }

        // run individual check on payload attributes, if no error is thrown here then payload values are ok
        await RunPayloadsParamsChecks(user, options, "create", options.name);

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
        const savedLoanSubCategory = await saveExpenseSubCategory(toSaveSubCategory);

        // add saved loan sub category into "Loans" category (since there is no cascade enabled and object is already saved, entry to many to many table is created when parent is saved)
        loansCategory.addSubCategory(savedLoanSubCategory);

        // add relationship between loans category and new sub category into many to many table
        const savedLoansCategory = await saveExpenseCategory(loansCategory);

        // update cached data for future get operations
        user.addLoan(savedLoan);
        user.addExpenseSubCategory(savedLoanSubCategory); // use saved sub category loan object
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
            loans = loans.filter((loan) => loan.archived === archivedFilter as boolean);
        }
        if(isFinishedFilter !== undefined) {
            loans = loans.filter((loan) => loan.isFinished === isFinishedFilter as boolean);
        }
        if(payFrequencyFilter !== undefined) {
            if(!isValidPayFrequency(payFrequencyFilter as number)) {
                throw new BadRequestError(`Invalid 'payFrequency' value: ${payFrequencyFilter} expected one of: [0, 1, 2, 3]`);
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

// #region PUT Loan
/**
* @swagger
* /api/v1/loans/{id}:
*   put:
*       summary: Update loan
*       description: From a given loan id, fetch the desired loan and apply all the updates that appear in the payload configuration.
*       tags:
*           - Loans
*       parameters:
*           - in: path
*             name: id
*             schema:
*               type: integer
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: "#/components/schemas/UpdateLoanPayload"
*       responses:
*           200:
*               description: A JSON representation of the updated loan.
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/ILoan"
*           400:
*               description: Bad Request Error
*           404:
*               description: Not Found Error
*/
router.put("/:id", async (req, res, next) => {
    try {
        const user    = req.userData;
        const options = req.body;
        const id      = req.params.id;

        // check if given id is in correct form
        if(!stringIsValidID(id)) {
            throw new BadRequestError(`Loan cannot be updated because the provided id "${id}" was in an incorrect format.`);
        }

        // validate a loan with the given id exists
        const parsedId = Number(id);
        if(!user.hasLoan(parsedId, "id")) {
            throw new NotFoundError(`Loan "${parsedId}" cannot be updated because it does not exist in user data.`);
        }

        /* CHECK PARENT LOANS CATEGORY AND LOAN SUBCATEGORY EXISTS */
        if(!user.hasExpenseCategory("Loans", "name")) {
            // throw server error since users MUST NOT be able to delete default categories
            throw new ServerError(`Loan "${parsedId}" cannot be updated because default parent "Loan" category does not exist.`);
        }
        const loansCategory = user.getExpenseCategoryByName("Loans");
        // since loan does exist, use its name to find the sub category
        if(!loansCategory.hasExpenseSubCategory(user.getLoanById(parsedId).name, "name")) {
            // throw server error since every card must be a sub category attached to the cards parent category
            throw new ServerError(`Loan "${parsedId}" cannot be updated because its expense sub category does not exist.`);
        }
        const loanSubCategory = user.getExpenseSubCategoryByName(user.getLoanById(parsedId).name);

        // check payload is in correct form
        if(!VerifyUpdateLoanBody(options)) {
            throw new BadRequestError(`Loan "${parsedId}" cannot be updated because a malformed payload was sent.`);
        }

        // run individual check on payload attributes, if no error is thrown here then payload values are ok
        await RunPayloadsParamsChecks(user, options, "update", user.getLoanById(parsedId).name);

        // update the in-memory object properties directly for future operations
        const toUpdate = user.setOptionsIntoLoan(parsedId, options);
        // apply loan changes in db using cached updated object
        const savedLoan = await saveLoan(toUpdate);

        // if loan name was updated, then update its sub category name
        if(options.name) {
            loanSubCategory.name = options.name; // this updates the value in memory
            await saveExpenseSubCategory(loanSubCategory); // this updates the entity in the db
        }

        return res.status(200).json(savedLoan.toInterfaceObject());
    } catch(error) { return next(error); }
});
// #endregion PUT Loan

export default router;
