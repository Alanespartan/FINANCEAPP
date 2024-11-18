import { Router } from "express";
import { AvailableCards, CreditCard, DebitCard } from "@cards";
import { CardOptions, CardTypes, UpdateCardOptions } from "@common/types/cards";
import { ExpenseCategory } from "@common/types/payments";
import { randomUUID } from "crypto";
import { BadRequestError } from "@backend/lib/errors";
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
                newCard = new DebitCard(options, false);
                break;
            case CardTypes.CREDIT:
                options.alias = `Tarjeta de Crédito ${options.issuer.name} ${options.cardNumber}`;
                newCard = new CreditCard(options, options.limit ?? 0);
                break;
            case CardTypes.VOUCHER:
                options.alias = `Tarjeta de Débito ${options.issuer.name} ${options.cardNumber}`;
                newCard = new DebitCard(options, true);
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
        return res.status(200).json({ cards });
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
        return res.status(200).json({ cards });
    } catch(error) { return next(error); }
});

router.post("/delete-card/:alias", (req, res) => {
    const user  = req.userData;
    const alias = req.params.alias;

    if(!user.hasCard(alias) || !user.hasCategory(alias)) { throw new Error(`${alias} doesn't exist.`); }

    user.removeCard(user.getCardIndex(alias));
    user.removeCategory(user.getCategoryIndex(alias)); // once card is deleted, remove related category

    return res.status(200);
});

router.post("/update-information/:alias", (req, res) => {
    const user    = req.userData;
    const alias   = req.params.alias;
    const options = req.body.newInfo as UpdateCardOptions;

    if(!user.hasCard(alias) || !user.hasCategory(alias)) { throw new Error(`${alias} doesn't exist.`); }

    const card     = user.getCard(user.getCardIndex(alias));
    const category = user.getCategory(user.getCategoryIndex(alias)); // use current alias to get existing category

    card.setCardNumber(options.cardNumber);
    card.setExpiryDate(options.expires);

    if(options.alias) {
        card.setAlias(options.alias);
    } else {
        options.alias = `Tarjeta de ${card instanceof CreditCard ? "Crédito" : "Débito"} ${card.getIssuerName()} ${options.cardNumber}`;
        card.setAlias(options.alias);
    }

    category.alias = card.getAlias(); // once card is updated, modify related category

    return res.status(200);
});

router.post("/update-limit/:alias", (req, res) => {
    const user     = req.userData;
    const alias    = req.params.alias;
    const current  = req.body.current;
    const newLimit = req.body.newLimit;

    if(!user.hasCard(alias)) { throw new Error(`${alias} doesn't exist.`); }

    const card = user.getCard(user.getCardIndex(alias)) as CreditCard;
    card.increaseLimit(current - newLimit);

    return res.status(200);
});

export default router;
