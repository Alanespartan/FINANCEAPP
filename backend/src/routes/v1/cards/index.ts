import { Router } from "express";
import {
    CreateCardPayload,
    OECardTypesFilters,
    UpdateCardPayload
} from "@common/types/cards";
import { CreateExpenseTypePayload, ETypesOfExpense } from "@common/types/expenses";
import { BadRequestError, NotFoundError } from "@errors";
import { ConvertToUTCTimestamp } from "@backend/utils/functions";
import { User, Card, ExpenseType } from "@entities";
import { getHeaders } from "@backend/utils/requests";
import {
    isValidCardFilter,
    isValidCardType
} from "./functions";
import { getUserCards, updateCard } from "@entities/cards/functions";
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
*       parameters:
*           - in: header
*             name: cardType
*             schema:
*               type: string
*             required: true
*       requestBody:
*           description: Payload that includes all the required new card data.
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: "#/components/schemas/CreateCardPayload"
*       responses:
*           200:
*               description: An array of cards a user has registered including the recently added.
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: "#/components/schemas/ICard"
*           400:
*               description: Bad Request Error
*/
router.post("/", async (req, res, next) => {
    try {
        const user    = req.userData;
        const options = req.body as CreateCardPayload;

        const { cardType } = getHeaders(req,
            [ "cardType", "Expected 'cardType' header was not provided." ]
        );

        const parsedType = parseInt(cardType);
        if(!isValidCardType(parsedType)) {
            throw new BadRequestError("Invalid type for creating a new card.");
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

        const newCard = new Card(options, parsedType, user.id);

        switch (parsedType) {
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
        await DBContextSource.manager.save(newCard);
        // get updated data from db (otherwise we don't know the new card id)
        const cards = await getUserCards(user.id);
        // update cached data for future get operations
        user.cards = [];
        user.cards = cards;

        // create expense category using card alias
        // so we can register when paying "TO A CARD"
        const newCardExpenseType = new ExpenseType({
            name: newCard.getName(),
            type: ETypesOfExpense.CARD,
            instrumentId: cards.find((c) => c.getCardNumber() === newCard.getCardNumber())?.getId()
        } as CreateExpenseTypePayload, user.id);
        user.addExpenseType(newCardExpenseType);
        await DBContextSource.manager.save(newCardExpenseType);

        return res.status(200).json(cards);
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

        if(filterBy === OECardTypesFilters.ALL) {
            return res.status(200).json(user.cards);
        } else {
            return res.status(200).json(user.cards.filter((card) => card.type === filterBy));
        }
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

        /* CARD TO UPDATE */
        // the given cardNumber to update contains only numbers
        if( !( /^[0-9]+$/.test(cardNumber) ) ) {
            throw new BadRequestError(`Invalid card number "${cardNumber}". A card number can not contain non numeric chars.`);
        }

        // a card with the given card number exists to be updated
        if(!user.hasCard(cardNumber)) {
            throw new NotFoundError(`There is no "${cardNumber}" card to update.`);
        }

        let cardNumberToReturn = cardNumber;
        /* NEW CARD NUMBER */
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

            cardNumberToReturn = options.cardNumber; // to know what card number to search for when returning json data
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

        // update card data in db
        await updateCard(user.getCardId(cardNumber), options);

        // get updated data from db
        const cards = await getUserCards(user.id);
        // update cached data for future operations
        user.cards = [];
        user.cards = cards;

        return res.status(200).json(cards.find((card) => card.getCardNumber() === cardNumberToReturn));
    } catch(error) { return next(error); }
});

export default router;
