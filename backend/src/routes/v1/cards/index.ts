import { Router } from "express";
import {
    OECardTypesFilters,
    UpdateCardPayload
} from "@common/types/cards";
import { CreateExpenseSubCategoryPayload, OETypesOfExpense } from "@common/types/expenses";
import { BadRequestError, NotFoundError, ServerError } from "@errors";
import { ConvertToUTCTimestamp } from "@backend/utils/functions";
import { Card, ExpenseSubCategory } from "@entities";
import { verifyCreateCardBody, isValidCardFilter, isValidCardType } from "@entities/cards/functions/util";
import { saveCard, getBank } from "@entities/cards/functions/db";
import { saveExpenseCategory, saveExpenseSubCategory } from "@entities/expenses/functions/db";

const router = Router();

// #region POST Card
/**
* @swagger
* /api/v1/cards:
*   post:
*       summary: New card
*       description: Create and assign a new card (debit, credit, voucher, services).
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
        const cardType = options.type;

        if(!verifyCreateCardBody(options)) {
            throw new BadRequestError("New card cannot be created because a malformed payload sent.");
        }

        // normalizing the card number by removing white spaces
        options.cardNumber = options.cardNumber.replace(/\s+/g, "");
        // remove any whitespace and then validate the cardNumber contains only numbers
        if( !( /^[0-9]+$/.test(options.cardNumber) ) ) {
            throw new BadRequestError(`Card "${options.cardNumber}" cannot be created because a card number can not contain non numeric chars.`);
        }

        if(!isValidCardType(cardType)) {
            throw new BadRequestError(`Card "${options.cardNumber}" cannot be created because an incorrect type was used in the request: ${cardType}.`);
        }

        if( !(await getBank(options.bankId)) ) {
            throw new BadRequestError(`Card "${options.cardNumber}" cannot be created because an incorrect bank id was used in the request: ${options.bankId}.`);
        }

        // avoid creating a duplicate if a card with the given card number already exists
        if(user.hasCard(options.cardNumber)) {
            throw new BadRequestError(`Card "${options.cardNumber}" cannot be created because one with that name already exists.`);
        }

        const newCard = new Card(options, user.id);

        switch (cardType) {
            case OECardTypesFilters.DEBIT:
                if(options.limit) {
                    throw new BadRequestError(`Debit card "${options.cardNumber}" cannot be created because an incorrect card limit was used in the request: ${options.type}.`);
                }
                if(options.isVoucher) {
                    newCard.setIsVoucher(true);
                }
                break;
            case OECardTypesFilters.CREDIT:
                if(!options.limit) {
                    throw new BadRequestError(`Credit card "${options.cardNumber}" cannot be created because no limit value was given to create the card.`);
                }
                if(options.limit <= 0) {
                    throw new BadRequestError(`Credit card "${options.cardNumber}" cannot be created because an incorrect card limit was used in the request: ${options.limit}.`);
                }
                if(options.isVoucher) {
                    throw new BadRequestError(`Credit card "${options.cardNumber}" cannot be created because it can not be categorized as voucher card.`);
                }
                // TODO CARD validate this scenario is working correclty: if new card is added with used balance or full balance
                newCard.setLimit(options.limit);
                break;
            case OECardTypesFilters.SERVICES:
                // services extra logic here
                break;
        }

        // save new card in db
        const savedCard = await saveCard(newCard);

        /* Developer Note:
            Updating both sides (e.g., adding the SubCategory to Category.subcategories and adding the Category to SubCategory.categories) is redundant.
            TypeORM will synchronize the relationship correctly based on the owning side (Category in this case).
        */
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

        // add sub category into "Cards" category (no need to have id since category has cascade when updated)
        cardsCategory.addSubCategory(toSaveSubCategory);

        // save updated cards category which is the owner of the relationship (it has JoinColumn decorator and cascade) and has the new sub category
        const savedCardsCategory = await saveExpenseCategory(cardsCategory);

        // update cached data for future get operations
        user.addCard(savedCard);
        cardsCategory = savedCardsCategory; // replace existing ref in memory value with returned object from query
        user.addExpenseSubCategory(savedCardsCategory.getExpenseSubCategoryByName(toSaveSubCategory.name)); // from returned object get the card sub category and add it to user array

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
*               type: integer
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
        if(!isValidCardFilter(filterBy)) {
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
*       summary: Update user card
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
        const options    = req.body as UpdateCardPayload;

        /* CARD NUMBER IS VALID */
        if( !( /^[0-9]+$/.test(cardNumber) ) ) {
            throw new BadRequestError(`Card "${cardNumber}" cannot be obtained because a card number can not contain non numeric chars.`);
        }

        /* CARD DOES EXISTS */
        if(!user.hasCard(cardNumber)) {
            throw new NotFoundError(`Card "${cardNumber}" cannot be updated because it does not exist in user data.`);
        }

        /* PARENT CARDS CATEGORY AND CARD SUBCATEGORIE EXISTS */
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

        /* CARD NUMBER */
        if(options.cardNumber) {
            // normalizing the given card number by removing white spaces
            options.cardNumber = options.cardNumber.replace(/\s+/g, "");

            // the new cardNumber contains only numbers
            if(!( /^[0-9]+$/.test(options.cardNumber) )) {
                throw new BadRequestError(`Card "${cardNumber}" cannot be updated because the new card number "${options.cardNumber}" can not contain non numeric chars.`);
            }

            // avoid creating a duplicate if a card with the new card number already exists
            if(user.hasCard(options.cardNumber)) {
                throw new BadRequestError(`Card "${cardNumber}" cannot be updated because one with the new card number "${options.cardNumber}" already exists.`);
            }
        }

        /* CARD EXPIRATION DATE */
        if(options.expires) {
            // using UTC function for correct timestamp comparision
            if(ConvertToUTCTimestamp(options.expires) < ConvertToUTCTimestamp(new Date())) {
                throw new BadRequestError(`Card "${cardNumber}" cannot be updated because new expiration date "${options.expires}" can't be less than today's date.`);
            }
        }

        /* CARD TYPE */
        let typeModified = false;
        if(options.type) {
            typeModified = true;
            if(!isValidCardType(options.type)) {
                throw new BadRequestError(`Card "${cardNumber}" cannot be updated because an incorrect new card type was used in the request: ${options.type}.`);
            }

            // if new type is debit card
            if(options.type === OECardTypesFilters.DEBIT) {
                // ensure no limit was sent in the payload
                if(options.limit) {
                    throw new BadRequestError(`Card "${cardNumber}" cannot be updated to debit card because an incorrect card limit was used in the request: ${options.limit}.`);
                }
                // avoid users modying limit of new debit card (previous credit card)
                // and restart limit value to default 0 to avoid errors
                options.limit = 0;
            }

            // if new type is credit card
            if(options.type === OECardTypesFilters.CREDIT) {
                // ensure a limit was sent in the payload
                if(!options.limit) {
                    throw new BadRequestError(`Card "${cardNumber}" cannot be updated to credit card because no limit value was given in the request.`);
                }

                if(options.limit <= 0) {
                    throw new BadRequestError(`Card "${cardNumber}" cannot be updated to credit card because an incorrect card limit was used in the request: ${options.limit}.`);
                }

                if(options.isVoucher) {
                    throw new BadRequestError(`Card "${cardNumber}" cannot be updated to credit card because it can not be categorized as voucher card.`);
                }

                // avoid users modying voucher state of new credit card (previous debit card)
                // and restart voucher value to default false to avoid errors
                options.isVoucher = false;
            }

            // TODO CARD if new type is service card add constraints (e.g. AMEX PLATINUM no limit)
        }

        /* LIMIT */
        if(options.limit && !typeModified) {
            // if user wants to set a limit to the given card to update but its not a credit card
            if(user.getCard(cardNumber).type !== OECardTypesFilters.CREDIT) {
                throw new BadRequestError(`Card "${cardNumber}" cannot be updated because a card limit (${options.limit}) was used in the request to update a non credit card.`);
            }
            // if the new limit of a credit card is less or equal to 0
            if(options.limit <= 0) {
                throw new BadRequestError(`Credit card "${cardNumber}" cannot be updated because an incorrect card limit was used in the request: ${options.limit}.`);
            }
        }

        /* IS VOUCHER */
        if(options.isVoucher && !typeModified) {
            // if user wants to set a limit to the given card to update but its not a credit card
            if(user.getCard(cardNumber).type !== OECardTypesFilters.DEBIT) {
                throw new BadRequestError(`Card "${cardNumber}" cannot be updated because it can not be categorized as voucher card.`);
            }
        }

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
