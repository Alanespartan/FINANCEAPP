import { ExpenseSubCategory } from "@entities";
import { BadRequestError } from "@errors";
import { saveExpenseCategory } from "@entities/expenses/functions/db";
import { isValidRealExpense, isValidExpenseSubCategoryFilter } from "@entities/expenses/functions/util";
import { CreateExpenseSubCategoryPayload, OETypesOfExpense } from "@common/types/expenses";
import { Router } from "express";

const router = Router();

/**
* @swagger
* /api/v1/expenses/subcategories:
*   post:
*       summary: New expense sub category
*       description: Create and assign a new expense sub category.
*       tags:
*           - Expenses
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: "#/components/schemas/CreateExpenseSubCategoryPayload"
*       responses:
*           201:
*               description: A JSON representation of the created expense sub category.
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/IExpenseSubCategory"
*           400:
*               description: Bad Request Error
*/
router.post("/", async (req, res, next) => {
    try {
        const user    = req.userData;
        const options = req.body as CreateExpenseSubCategoryPayload;

        // avoid creating sub categories with incorrect type (cards and loans sub categories must be created on their respective endpoints)
        if(!isValidRealExpense(options.type)) {
            throw new BadRequestError(`Subcategory "${options.name}" cannot be created because an incorrect type filter was used in the request: ${options.type}.`);
        }

        // check if parent category does really exist in user info
        if(!user.hasExpenseCategory(options.categoryId, "id")) {
            throw new BadRequestError(`Parent category cannot be obtained because an incorrect id was used in the request: ${options.categoryId}.`);
        }

        // avoid creating a duplicate if an expense sub category with the given name already exists
        if(user.hasExpenseSubCategory(options.name, "name")) {
            throw new BadRequestError(`Subcategory "${options.name}" cannot be created because one with that name already exists.`);
        }

        // get parent expense category
        let parentCategory = user.getExpenseCategoryById(options.categoryId);

        // create new expense sub category using payload info
        const toSaveSubCategory = new ExpenseSubCategory(options, user.id);

        // add new sub category object into "Parent" category (no need to have new object id since category entity has cascade insert option enabled)
        parentCategory.addSubCategory(toSaveSubCategory);

        // save updated parent category which is the owner of the relationship and has the new sub category
        const savedParentCategory = await saveExpenseCategory(parentCategory);

        // update cached data for future get operations
        parentCategory = savedParentCategory; // replace existing ref in memory value with returned object from query
        // from returned object get the new sub category and add it to user array
        const createdSubCategory = parentCategory.getExpenseSubCategoryByName(toSaveSubCategory.name);
        user.addExpenseSubCategory(createdSubCategory);

        return res.status(201).json(createdSubCategory.toInterfaceObject());
    } catch(error) { return next(error); }
});

/**
* @swagger
* /api/v1/expenses/subcategories:
*   get:
*       summary: Fetch expense sub categories
*       description: Get all expense sub categories a user has registered.
*       tags:
*           - Expenses
*       parameters:
*           - in: query
*             name: type
*             schema:
*               type: integer
*       responses:
*           200:
*               description: An array of expense sub categories a user has registered.
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: "#/components/schemas/IExpenseSubCategory"
*           400:
*               description: Bad Request Error
*/
router.get("/", async (req, res, next) => {
    try {
        const user = req.userData;
        const type = req.query.type; // by default is always "ALL" expense sub categories (if not modified by user in the front end)

        if(type && typeof type !== "string") {
            throw new BadRequestError("Subcategories cannot be obtained because the type filter provided was in an incorrect format.");
        }

        // If no type given, default is to get all
        const filterBy = type ? parseInt(type) : OETypesOfExpense.ALL;
        if(!isValidExpenseSubCategoryFilter(filterBy)) {
            throw new BadRequestError(`Subcategories cannot be obtained because an incorrect type filter was used in the request: ${filterBy}.`);
        }

        return res.status(200).json(user.getExpenseSubCategories(filterBy));
    } catch(error) { return next(error); }
});

export default router;
