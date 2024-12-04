import { Router } from "express";
import {
    OECardTypesFilters,
    UpdateCardPayload
} from "@common/types/cards";
import { CreateExpenseTypePayload, OETypesOfExpense } from "@common/types/expenses";
import { BadRequestError, NotFoundError } from "@errors";
import { ConvertToUTCTimestamp } from "@backend/utils/functions";
import { User, Card, ExpenseType } from "@entities";
import { verifyCreateCardBody, isValidCardFilter, isValidCardType } from "./functions/util";
import { saveCard, getBank } from "./functions/db";
import DBContextSource from "@db";

const router = Router();

/**
* @swagger
* /api/v1/cards:
*   post:
*       summary: Create a new user card
*       description: Given a configuration of card options, create and assign a new card (debit, credit, voucher, services) to the user information
*       tags:
*           - Cards
*       requestBody:
*           description: Payload that includes all the required new card data.
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
            throw new BadRequestError("Malformed payload sent.");
        }

        if(!isValidCardType(cardType)) {
            throw new BadRequestError(`Invalid type (${cardType}) for creating a new card.`);
        }

        if( !(await getBank(options.bankId)) ) {
            throw new BadRequestError(`Invalid bank id (${options.bankId}) for creating a new card.`);
        }

        // normalizing the card number by removing white spaces
        options.cardNumber = options.cardNumber.replace(/\s+/g, "");
        // remove any whitespace and then validate the cardNumber contains only numbers
        if( !( /^[0-9]+$/.test(options.cardNumber) ) ) {
            throw new BadRequestError(`Invalid card number "${options.cardNumber}". A card number can not contain non numeric chars.`);
        }
        // avoid creating a duplicate if a card with the given card number already exists
        if(user.cards.find((c) => c.cardNumber === options.cardNumber)) {
            throw new BadRequestError(`A card with the "${options.cardNumber}" number already exists.`);
        }

        const newCard = new Card(options, user.id);

        switch (cardType) {
            case OECardTypesFilters.DEBIT:
                if(options.limit) {
                    throw new BadRequestError("A debit card can't have a limit.");
                }
                if(options.isVoucher) {
                    newCard.setIsVoucher(true);
                }
                break;
            case OECardTypesFilters.CREDIT:
                if(!options.limit) {
                    throw new BadRequestError("No limit value was given to create the new credit card.");
                }
                if(options.limit <= 0) {
                    throw new BadRequestError("Can't set the limit of a credit card to have a value of less or equal to 0.");
                }
                if(options.isVoucher) {
                    throw new BadRequestError("A credit card can't be categorized as a voucher card.");
                }
                newCard.setLimit(options.limit);
                break;
            case OECardTypesFilters.SERVICES:
                // services extra logic here
                break;
        }

        // save new card in db
        const savedCard = await saveCard(newCard);
        // update cached data for future get operations
        user.addCard(savedCard);

        // TODO EXPENSE TYPE add functions
        // create expense category using card alias
        // so we can register when paying "TO A CARD"
        const newCardExpenseType = new ExpenseType({
            name: savedCard.getName(),
            type: OETypesOfExpense.CARD,
            instrumentId: savedCard.getId()
        } as CreateExpenseTypePayload, user.id);
        user.addExpenseType(newCardExpenseType);
        await DBContextSource.manager.save(newCardExpenseType);

        return res.status(201).json(savedCard.toInterfaceObject());
    } catch(error) { return next(error); }
});

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
        const user: User = req.userData;
        const cardType = req.query.cardType; // by default is always "ALL" cards (if not modified by user in the front end)

        if(cardType && typeof cardType !== "string") {
            throw new BadRequestError("No card type filter was given in the correct format.");
        }

        // If no cardType given, default is to get all
        const filterBy = cardType ? parseInt(cardType) : OECardTypesFilters.ALL;
        if(!isValidCardFilter(filterBy)) {
            throw new BadRequestError("Invalid type for filtering cards.");
        }

        return res.status(200).json(user.getCards(filterBy));
    } catch(error) { return next(error); }
});

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
*               description: The current card number assigned to the desired card to update.
*       requestBody:
*           description: Payload that includes all the desired updates for the given card.
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
*/
router.put("/:cardNumber", async (req, res, next) => {
    try {
        const user       = req.userData;
        const cardNumber = req.params.cardNumber.replace(/\s+/g, ""); // normalizing the given card number by removing white spaces
        const options    = req.body as UpdateCardPayload;

        /* CARD IS VALID */
        // the given cardNumber to update contains only numbers
        if( !( /^[0-9]+$/.test(cardNumber) ) ) {
            throw new BadRequestError(`Invalid card number "${cardNumber}". A card number can not contain non numeric chars.`);
        }

        // a card with the given card number exists to be updated
        if(!user.hasCard(cardNumber)) {
            throw new NotFoundError(`There is no "${cardNumber}" card to update.`);
        }

        /* CARD NUMBER */
        if(options.cardNumber) {
            // normalizing the given card number by removing white spaces
            options.cardNumber = options.cardNumber.replace(/\s+/g, "");

            // the new cardNumber contains only numbers
            if(!( /^[0-9]+$/.test(options.cardNumber) )) {
                throw new BadRequestError(`Invalid new card number "${options.cardNumber}". A card number can not contain non numeric chars.`);
            }

            // avoid creating a duplicate if a card with the new card number already exists
            if(user.hasCard(options.cardNumber)) {
                throw new BadRequestError(`A card with the "${options.cardNumber}" number already exists.`);
            }
        }

        /* CARD EXPIRATION DATE */
        if(options.expires) {
            // using UTC function for correct timestamp comparision
            if(ConvertToUTCTimestamp(options.expires) < ConvertToUTCTimestamp(new Date())) {
                throw new BadRequestError(`New expiration date "${options.expires}" can't be less than today's date.`);
            }
        }

        /* CARD TYPE */
        let typeModified = false;
        if(options.type) {
            typeModified = true;
            if(!isValidCardType(options.type)) {
                throw new BadRequestError(`Invalid card type: "${options.type}" given for updating "${cardNumber}" card.`);
            }

            // if new type is debit card
            if(options.type === OECardTypesFilters.DEBIT) {
                // ensure no limit was sent in the payload
                if(options.limit) {
                    throw new BadRequestError(`Can't update the limit of "${cardNumber}" card if it's going to be a Debit Card.`);
                }
                // avoid users modying limit of new debit card (previous credit card)
                // and restart limit value to default 0 to avoid errors
                options.limit = 0;
            }

            // if new type is credit card
            if(options.type === OECardTypesFilters.CREDIT) {
                // ensure a limit was sent in the payload
                if(!options.limit) {
                    throw new BadRequestError(`No limit value was provided for updating "${cardNumber}" card to be a Credit Card.`);
                }

                if(options.limit <= 0) {
                    throw new BadRequestError("Can't set the limit of a credit card to have a value of less or equal to 0.");
                }

                if(options.isVoucher) {
                    throw new BadRequestError("Can't update a credit card to be a voucher card.");
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
            if(user.getCardType(cardNumber) !== OECardTypesFilters.CREDIT) {
                throw new BadRequestError("Can't modify the limit attribute of a non credit card.");
            }
            // if the new limit of a credit card is less or equal to 0
            if(options.limit <= 0) {
                throw new BadRequestError("Can't modify the limit of a credit card to have a value of less or equal to 0.");
            }
        }

        /* IS VOUCHER */
        if(options.isVoucher && !typeModified) {
            // if user wants to set a limit to the given card to update but its not a credit card
            if(user.getCardType(cardNumber) !== OECardTypesFilters.DEBIT) {
                throw new BadRequestError("Can't modify the voucher state of a non debit card.");
            }
        }

        // update cached card data
        const toUpdate = user.setOptionsIntoCard(cardNumber, options);
        // apply card changes in db using updated object
        const savedCard = await saveCard(toUpdate);

        return res.status(200).json(savedCard.toInterfaceObject());
    } catch(error) { return next(error); }
});

export default router;
