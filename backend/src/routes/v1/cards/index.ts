import { MyRouter } from "../../MyRouter";
import { CreditCard, DebitCard } from "../../../lib/cards";
import { CardOptions, CardTypes, UpdateCardOptions } from "@common/types/cards";

const router = new MyRouter();

router.post("/add-card", (req, res) => {
    const user    = req.userData;
    const options = req.body.options as CardOptions;
    const type    = req.body.type as CardTypes;
    let newCard: CreditCard | DebitCard;
    switch(type) {
        case CardTypes.CREDIT:
            options.alias = `Tarjeta de Crédito ${options.issuer.name} ${options.cardNumber}`;
            newCard = new CreditCard(options, options.limit ? options.limit : 0);
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
    user.addCard(newCard);
    
    return res.status(200);
});
router.post("/delete-card/:alias", (req, res) => {
    const user  = req.userData;
    const alias = req.params.alias;
    const index = req.body.index;

    if(!user.hasCard(alias)) { throw new Error("Card doesn't exist."); }

    user.removeCard(index);

    return res.status(200);
});
router.post("/update-limit/:alias", (req, res) => {
    const user     = req.userData;
    const alias    = req.params.alias;
    const current  = req.body.current;
    const newLimit = req.body.newLimit;

    if(!user.hasCard(alias)) { throw new Error("Card doesn't exist."); }

    user.getCard(false, alias).addBalance(current - newLimit);

    return res.status(200);
});
router.post("/update-information/:alias", (req, res) => {
    const user    = req.userData;
    const alias   = req.params.alias;
    const options = req.body.newInfo as UpdateCardOptions;

    if(!user.hasCard(alias)) { throw new Error("Card doesn't exist."); }

    const card = user.getCard(false, alias);

    card.setCardNumber(options.cardNumber);
    card.setExpiryDate(options.expires);
    
    if(options.alias) { 
        card.setAlias(options.alias);
    } else {
        options.alias = `Tarjeta de ${card instanceof CreditCard ? "Crédito" : "Débito"} ${card.getIssuerName()} ${options.cardNumber}`;
        card.setAlias(options.alias);
    }

    return res.status(200);
});

export default router;