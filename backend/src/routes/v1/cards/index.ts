import { Router } from "express";
import { AvailableCards, CreditCard, DebitCard } from "@cards";
import { CardOptions, CardTypes, UpdateCardOptions } from "@common/types/cards";
import { ExpenseCategory } from "@common/types/payments";
import { randomUUID } from "crypto";
import { BadRequestError, NotFoundError } from "@backend/lib/errors";
import { User } from "@backend/session/user";
import { getHeaders } from "@backend/utils/requests";

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
*                       $ref: "#/components/schemas/CardOptions"
*       responses:
*           200:
*               description: An array of cards a user has registered including the recently added.
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: "#/components/schemas/AvailableCards"
*           400:
*               description: Bad Request Error
*/
router.post("/", (req, res, next) => {
    try {
        const user    = req.userData;
        const options = req.body as CardOptions;

        const { cardType } = getHeaders(req,
            [ "cardType", "Expected 'cardType' header was not provided." ]
        );

        let newCard: CreditCard | DebitCard;
        switch (parseInt(cardType)) {
            case CardTypes.DEBIT:
                options.alias = `Tarjeta de Débito ${options.issuer.name} ${options.cardNumber}`;
                newCard = new DebitCard(options, options.isVoucher ? true : false);
                break;
            case CardTypes.CREDIT:
                options.alias = `Tarjeta de Crédito ${options.issuer.name} ${options.cardNumber}`;
                newCard = new CreditCard(options, options.limit ?? 0);
                break;
            case CardTypes.SERVICES:
                options.alias = `Tarjeta de Servicios ${options.issuer.name} ${options.cardNumber}`;
                newCard = new CreditCard(options, options.limit ?? 0); // Add class for services class (e.g. amex platinum)
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

        const cards: AvailableCards[] = user.getCards(CardTypes.ALL);
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
*                               $ref: "#/components/schemas/AvailableCards"
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

        const filterBy = cardType ? parseInt(cardType) : CardTypes.ALL; // Default get all
        if(!(filterBy in CardTypes)) {
            throw new BadRequestError("Invalid type for filtering cards.");
        }

        const cards: AvailableCards[] = user.getCards(filterBy);
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
*       requestBody:
*           description: Payload that includes all the desired updates for the given card.
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: "#/components/schemas/UpdateCardOptions"
*       responses:
*           200:
*               description: A JSON representation of the updated card.
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/AvailableCards"
*           400:
*               description: Bad Request Error
*           404:
*               description: Not Found Error
*/
router.put("/:cardNumber", (req, res, next) => {
    try {
        const user       = req.userData;
        const cardNumber = req.params.cardNumber;
        const options    = req.body as UpdateCardOptions;

        const card = user.getCard(cardNumber);
        if(!card) throw new NotFoundError(`There is no "${cardNumber}" card in the user data.`);

        const category = user.getCategory(card.getAlias()); // use current alias to get existing category
        if(!category) throw new NotFoundError(`There is no "${card.getAlias()}" registered as an expense category.`);

        // CARD NUMBER
        if(options.cardNumber) card.setCardNumber(options.cardNumber);

        // ARCHIVED
        if(options.archived) card.setArchived(options.archived);

        // CARD EXPIRATION DATE
        if(options.expires) {
            if(options.expires.getTime() < new Date().getTime()) {
                throw new BadRequestError(`New expiration date "${options.expires}" can't be less than today's date.`);
            }
            card.setExpirationDate(options.expires);
        }

        // CARD TYPE
        if(options.type) {
            if(!(options.type in CardTypes)) {
                throw new BadRequestError(`Invalid card type: "${options.type}" for updating "${card.getAlias()}" card.`);
            }

            card.setCardType(options.type);

            // if new type is credit card
            if(card.getCardType() === CardTypes.CREDIT) {
                // ensure a limit was sent in the payload
                if(!options.limit) {
                    throw new BadRequestError(`No limit value was provided for updating "${card.getAlias()}" card to be a Credit Card.`);
                }
                (card as CreditCard).setLimit(options.limit);
            }

            // TODO if new type is service card (e.g. AMEX PLATINUM no limit)
        }

        // LIMIT
        if(options.limit) {
            if(card.getCardType() !== CardTypes.CREDIT) {
                throw new BadRequestError("Can't modify the limit attribute from a non credit card.");
            }

            if(options.limit <= 0) {
                throw new BadRequestError("Can't modify the limit of a credit card to have a value of less or equal to 0.");
            }

            (card as CreditCard).setLimit(options.limit);
        }

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

        return res.send(200).json(card);
    } catch(error) { return next(error); }
});

export default router;
