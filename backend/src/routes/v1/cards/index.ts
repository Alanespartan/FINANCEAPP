import { Router } from "express";
import { Card } from "@backend/lib/entities";
import { CreateCardPayload, ECardTypes, UpdateCardPayload } from "@common/types/cards";
import { ExpenseCategory } from "@common/types/payments";
import { randomUUID } from "crypto";
import { BadRequestError } from "@backend/lib/errors";
import { User } from "@backend/lib/entities/users/user";
import { getHeaders } from "@backend/utils/requests";
import { ValidateUpdateCardPayload } from "./functions";

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
router.post("/", (req, res, next) => {
    try {
        const user    = req.userData;
        const options = req.body as CreateCardPayload;

        const { cardType } = getHeaders(req,
            [ "cardType", "Expected 'cardType' header was not provided." ]
        );

        // remove any whitespace and then validate the cardNumber contains only numbers
        if( !( /^[0-9]+$/.test(options.cardNumber.replace(/\s+/g, "")) ) ) {
            throw new BadRequestError(`Invalid card number "${options.cardNumber}". A card number can not contain non numeric chars.`);
        }

        // avoid creating a duplicate if the card number already exists
        if(user.getCard(options.cardNumber)) {
            throw new BadRequestError(`A card with the "${options.cardNumber}" card number already exist in user data.`);
        }

        let newCard: Card;
        switch (parseInt(cardType)) {
            case ECardTypes.DEBIT:
                options.alias = `Tarjeta de Débito ${options.issuer.name} ${options.cardNumber}`;
                newCard = new Card(options, ECardTypes.DEBIT);
                if(options.isVoucher) {
                    newCard.setIsVoucher(true);
                }
                break;
            case ECardTypes.CREDIT:
                options.alias = `Tarjeta de Crédito ${options.issuer.name} ${options.cardNumber}`;
                newCard = new Card(options, ECardTypes.CREDIT);
                if(options.limit) {
                    newCard.setLimit(options.limit);
                }
                break;
            case ECardTypes.SERVICES:
                options.alias = `Tarjeta de Servicios ${options.issuer.name} ${options.cardNumber}`;
                newCard = new Card(options, ECardTypes.SERVICES);
                break;
            default: throw new BadRequestError("Invalid type for creating a new card.");
        }

        // add card to user array of cards
        user.addCard(newCard);

        // create expense category using card alias
        // so we can register when paying "TO A CARD"
        user.addCategory({
            id:        randomUUID(),
            alias:     newCard.getAlias(),
            isDefault: false
        } as ExpenseCategory);

        const cards: Card[] = user.getCards(ECardTypes.ALL);
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
router.get("/", (req, res, next) => {
    try {
        const user: User = req.userData;
        const cardType = req.query.cardType; // by default is always "ALL" cards (if not modified by user in the front end)

        if(cardType && typeof cardType !== "string") {
            throw new BadRequestError("No card type filter was given in the correct format.");
        }

        const filterBy = cardType ? parseInt(cardType) : ECardTypes.ALL; // Default get all
        if(!(filterBy in ECardTypes)) {
            throw new BadRequestError("Invalid type for filtering cards.");
        }

        const cards: Card[] = user.getCards(filterBy);
        return res.status(200).json(cards);
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
router.put("/:cardNumber", (req, res, next) => {
    try {
        const user       = req.userData;
        const cardNumber = req.params.cardNumber;
        const options    = req.body as UpdateCardPayload;

        if(ValidateUpdateCardPayload(user, cardNumber, options)) {
            const card     = user.getCard(cardNumber) as Card;
            const category = user.getCategory(card.getAlias()) as ExpenseCategory;

            // CARD NUMBER
            if(options.cardNumber) card.setCardNumber(options.cardNumber);

            // ARCHIVED
            if(options.archived) card.setArchived(options.archived);

            // CARD EXPIRATION DATE
            if(options.expires) card.setExpirationDate(options.expires);

            // CARD TYPE
            if(options.type) card.setCardType(options.type);

            // LIMIT
            if(options.limit) card.setLimit(options.limit);

            // If no new alias, number nor card type were given, generate 1 automatically that matches the new card settings
            if(options.alias) {
                card.setAlias(options.alias);
            } else {
                const type = `${card.getCardType() === 1 ? "Débito" : card.getCardType() === 2 ? "Crédito" : card.getCardType() === 3 ? "Servicios" : "UNDEFINED_TYPE" }`;
                options.alias = `Tarjeta de ${type} ${card.getIssuerName()} ${options.cardNumber}`;
                card.setAlias(options.alias);
            }

            // once the card is updated, modify the related expense category and all of its records
            category.alias = card.getAlias();
            // TODO verify that when this category is updated, all the existing expenses related to this category are update too

            return res.status(200).json(card);
        }
        throw new BadRequestError(`An error occurred while updating "${cardNumber}" card. `);
    } catch(error) { return next(error); }
});

export default router;
