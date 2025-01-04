import { Router } from "express";
import { OECardTypesFilters } from "@common/types/cards";
import { CreateExpenseSubCategoryPayload, OETypesOfExpense } from "@common/types/expenses";
import { BadRequestError, NotFoundError, ServerError } from "@errors";
import { Card, ExpenseSubCategory } from "@entities";
import { RunPayloadsParamsChecks, VerifyCreateCardBody, VerifyUpdateCardBody, IsValidCardFilter } from "@entities/cards/functions/util";
import { saveCard } from "@entities/cards/functions/db";
import { saveExpenseCategory, saveExpenseSubCategory } from "@entities/expenses/functions/db";

const router = Router();

// #region POST Card
/**
* @swagger
* /api/v1/cards:
*   post:
*       summary: New card
*       description: Create and save a new card (debit, credit, voucher, services).
*       tags:
*           - Cards
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: "#/components/schemas/CreateCardPayload"
*       responses:
*           201:
*               description: A JSON representation of the created card.
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/ICard"
*           400:
*               description: Bad Request Error
*/
router.post("/", async (req, res, next) => {
    try {
        const user     = req.userData;
        const options  = req.body;

        // check payload is in correct form
        if(!VerifyCreateCardBody(options)) {
            throw new BadRequestError("New card cannot be created because a malformed payload was sent.");
        }

        // run individual check on payload attributes, if no error is thrown here then payload values are ok
        await RunPayloadsParamsChecks(user, options, "create", options.cardNumber);

        // save new card in db
        const newCard = new Card(options, user.id);
        const savedCard = await saveCard(newCard);

        // get cards default parent expense category
        let cardsCategory = user.getExpenseCategoryByName("Cards");

        // create new expense sub category using card info so we can register when paying "TO THIS CARD"
        const toSaveSubCategory = new ExpenseSubCategory(
            {
                name: savedCard.name,
                type: OETypesOfExpense.CARD,
                instrumentId: savedCard.id
            } as CreateExpenseSubCategoryPayload, user.id
        );
        // save new card sub category
        const savedCardSubCategory = await saveExpenseSubCategory(toSaveSubCategory);

        // add saved card sub category into "Cards" category (since there is no cascade enabled and object is already saved, entry to many to many table is created when parent is saved)
        cardsCategory.addSubCategory(savedCardSubCategory);

        // add relationship between cards category and new sub category into many to many table
        const savedCardsCategory = await saveExpenseCategory(cardsCategory);

        // update cached data for future get operations
        user.addCard(savedCard);
        user.addExpenseSubCategory(savedCardSubCategory); // use saved sub category card object
        cardsCategory = savedCardsCategory; // replace existing ref in memory value with returned object from query

        return res.status(201).json(savedCard.toInterfaceObject());
    } catch(error) { return next(error); }
});
// #endregion POST Card

// #region GET Cards
/**
* @swagger
* /api/v1/cards:
*   get:
*       summary: Get user cards
*       description: Get all cards a user has registered. These can be credit, debit, voucher or a services card. If no type was given for filtering in the request, all cards are returned.
*       tags:
*           - Cards
*       parameters:
*           - in: query
*             name: cardType
*             schema:
*               $ref: "#/components/schemas/TCardFilters"
*       responses:
*           200:
*               description: An array of cards a user has registered.
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: "#/components/schemas/ICard"
*           400:
*               description: Bad Request Error
*/
router.get("/", async (req, res, next) => {
    try {
        const user     = req.userData;
        const cardType = req.query.cardType; // by default is always "ALL" cards (if not modified by user in the front end)

        if(cardType && typeof cardType !== "string") {
            throw new BadRequestError("Cards cannot be obtained because the card type filter provided was in an incorrect format.");
        }

        // If no cardType given, default is to get all
        const filterBy = cardType ? parseInt(cardType) : OECardTypesFilters.ALL;
        if(!IsValidCardFilter(filterBy)) {
            throw new BadRequestError(`Cards cannot be obtained because an incorrect card type filter was used in the request: ${filterBy}.`);
        }

        return res.status(200).json(user.getCards(filterBy));
    } catch(error) { return next(error); }
});
// #endregion GET Cards

// #region GET Card
/**
* @swagger
* /api/v1/cards/{cardNumber}:
*   get:
*       summary: Fetch card
*       description: Get desired card from user data using an id.
*       tags:
*           - Cards
*       parameters:
*           - in: path
*             name: cardNumber
*             schema:
*               type: string
*       responses:
*           200:
*               description: A JSON representation of the desired card.
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/ICard"
*           400:
*               description: Bad Request Error
*           404:
*               description: Not Found Error
*/
router.get("/:cardNumber", async (req, res, next) => {
    try {
        const user       = req.userData;
        const cardNumber = req.params.cardNumber.replace(/\s+/g, ""); // normalizing the given card number by removing white spaces

        /* CARD NUMBER IS VALID */
        if( !( /^[0-9]+$/.test(cardNumber) ) ) {
            throw new BadRequestError(`Card "${cardNumber}" cannot be obtained because a card number can not contain non numeric chars.`);
        }

        /* CARD DOES EXISTS */
        if(!user.hasCard(cardNumber)) {
            throw new NotFoundError(`Card "${cardNumber}" cannot be obtained because it does not exist in user data.`);
        }

        return res.status(200).json(user.getCard(cardNumber).toInterfaceObject());
    } catch(error) { return next(error); }
});
// #endregion GET Card

// #region PUT Card
/**
* @swagger
* /api/v1/cards/{cardNumber}:
*   put:
*       summary: Update card
*       description: From a given card number, fetch the desired card and apply all the updates that appear in the payload configuration.
*       tags:
*           - Cards
*       parameters:
*           - in: path
*             name: cardNumber
*             schema:
*               type: string
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: "#/components/schemas/UpdateCardPayload"
*       responses:
*           200:
*               description: A JSON representation of the updated card.
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/ICard"
*           400:
*               description: Bad Request Error
*           404:
*               description: Not Found Error
*           500:
*               description: Server Error
*/
router.put("/:cardNumber", async (req, res, next) => {
    try {
        const user       = req.userData;
        const cardNumber = req.params.cardNumber.replace(/\s+/g, ""); // normalizing the given card number by removing white spaces
        const options    = req.body;

        // check if given id is in correct form
        if( !( /^[0-9]+$/.test(cardNumber) ) ) {
            throw new BadRequestError(`Card "${cardNumber}" cannot be obtained because a card number can not contain non numeric chars.`);
        }

        // validate a card with the given id exists
        if(!user.hasCard(cardNumber)) {
            throw new NotFoundError(`Card "${cardNumber}" cannot be updated because it does not exist in user data.`);
        }

        /* CHECK PARENT CARDS CATEGORY AND CARD SUBCATEGORIE EXISTS */
        if(!user.hasExpenseCategory("Cards", "name")) {
            // throw server error since users MUST NOT be able to delete default categories
            throw new ServerError(`Card "${cardNumber}" cannot be updated because default parent "Card" category does not exist.`);
        }
        const cardsCategory = user.getExpenseCategoryByName("Cards");
        // since card does exist, use its name to find the sub category
        if(!cardsCategory.hasExpenseSubCategory(user.getCard(cardNumber).name, "name")) {
            // throw server error since every card must be a subcategorie attached to the cards parent category
            throw new ServerError(`Card "${cardNumber}" cannot be updated because its expense sub categorie does not exist.`);
        }
        const cardSubCategory = user.getExpenseSubCategoryByName(user.getCard(cardNumber).name);

        // check payload is in correct form
        if(!VerifyUpdateCardBody(options)) {
            throw new BadRequestError(`Card "${cardNumber}" cannot be updated because a malformed payload was sent.`);
        }

        // run individual check on payload attributes, if no error is thrown here then payload values are ok
        await RunPayloadsParamsChecks(user, options, "update", cardNumber);

        // update cached card data using payload
        const toUpdate = user.setOptionsIntoCard(cardNumber, options);
        // apply card changes in db using cached updated object
        const savedCard = await saveCard(toUpdate);

        // if card name was updated, then update its sub category name
        if(options.name) {
            cardSubCategory.name = options.name; // this updates the value in memory
            await saveExpenseSubCategory(cardSubCategory); // this updates the entity in the db
        }

        return res.status(200).json(savedCard.toInterfaceObject());
    } catch(error) { return next(error); }
});
// #endregion PUT Card

export default router;
