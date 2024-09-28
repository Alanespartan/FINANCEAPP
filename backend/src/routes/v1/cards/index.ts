import { Router } from "express";
import { CreditCard, DebitCard } from "@cards";
import { CardOptions, CardTypes, UpdateCardOptions } from "@common/types/cards";
import { ExpenseCategory } from "@common/types/payments";
import { randomUUID } from "crypto";

const router = Router();

router.post("/add-card", (req, res) => {
    const user    = req.userData;
    const options = req.body.options as CardOptions;
    const type    = req.body.type as CardTypes;

    let newCard: CreditCard | DebitCard;
    switch (type) {
        case CardTypes.CREDIT:
            options.alias = `Tarjeta de Crédito ${options.issuer.name} ${options.cardNumber}`;
            newCard = new CreditCard(options, options.limit ?? 0);
            break;
        case CardTypes.DEBIT:
            options.alias = `Tarjeta de Débito ${options.issuer.name} ${options.cardNumber}`;
            newCard = new DebitCard(options, false);
            break;
        case CardTypes.VOUCHER:
            options.alias = `Tarjeta de Débito ${options.issuer.name} ${options.cardNumber}`;
            newCard = new DebitCard(options, true);
            break;
    }

    // add card to user array of cards
    user.addCard(newCard);

    // create category using card alias
    user.addCategory({
        id:        randomUUID(),
        alias:     newCard.getAlias(),
        isDefault: false
    } as ExpenseCategory);

    return res.status(200);
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
