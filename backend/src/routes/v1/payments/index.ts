import { randomUUID } from "crypto";
import { Router } from "express";
import { Expense, PaymentConfig, PaymentMethod } from "@common/types/payments";
import { BadRequestError } from "@backend/lib/errors";

const router = Router();

router.post("/add-payment", (req, res) => {
    const user    = req.userData;
    const options = req.body as PaymentConfig;

    // create expense record
    const newExpense = {
        id:          randomUUID(),
        total:       options.total,
        category:    options.category,
        comment:     options.comment,
        paymentDate: new Date(),
    } as Expense;
    newExpense.method = options.method; // e.g. CARD or CARD for easy filtering

    if(options.method === PaymentMethod.CASH) {
        user.decreaseCash(newExpense.total);
    } else if(options.method === PaymentMethod.CARD && options.cardOptions) {
        // can't use the card to pay its missing balance
        if(options.cardOptions.alias === newExpense.category.alias) {
            throw new BadRequestError(`Can't use ${options.cardOptions.cardNumber} to pay for ${newExpense.category.alias}.`);
        }

        const card = user.getCard(options.cardOptions.cardNumber);
        if(!card) {
            throw new BadRequestError(`There is no "${options.cardOptions.cardNumber}" card in the user data.`);
        }

        card.pay(newExpense.total); // reduce balance from card used for payment
    }

    // if what the user paid was a card, add balance to that other card
    if(newExpense.category.isCard && options.cardOptions) {
        const paidCard = user.getCardByAlias(newExpense.category.alias);
        if(!paidCard) {
            throw new BadRequestError(`Can not register a payment against "${newExpense.category.alias}" card since it does not exist in the user data.`);
        }
        paidCard.addBalance(newExpense.total);
    }

    // if what the user paid was a loan, add balance to that loan
    if(user.hasLoan(newExpense.category.alias)) {
        user.getLoan(user.getLoanIndex(newExpense.category.alias)).pay(newExpense.total);
    }

    user.addExpense(newExpense);

    return res.status(200);
});

// todo create endpoint to add balance to savings account and pull money from it

export default router;
