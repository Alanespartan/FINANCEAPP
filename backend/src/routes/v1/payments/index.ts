import { MyRouter } from "../../MyRouter";
import { CardOptions } from "@common/types/cards";
import { CardTypes } from "@common/types/cards";
import { Expense, PaymentConfig } from "@common/types/payments";
import { randomUUID } from "crypto";

const router = new MyRouter();

router.post("/user-payment", (req, res) => {
    const user    = req.userData;
    const options = req.body.options as PaymentConfig;
    if(!user) throw new Error("User data not found");
    
    // create expense record
    const newExpense = {
        id:          randomUUID(),
        total:       options.total,
        category:    options.category,
        paymentDate: new Date(),
        comment:     options.comment
    } as Expense;
    newExpense.method.type = options.method;
    if(options.method === "CASH") {
        newExpense.method.name = options.method;
        // reduce cash balance
        user.decreaseCash(newExpense.total);
    } else if(options.method === "CARD" && options.cardOptions) {
        if(!user.hasCard(options.cardOptions.cardAlias)) { throw new Error(`${options.cardOptions.cardAlias} doesn't exist in user information.`); }
        newExpense.method.name = options.cardOptions.cardAlias; // e.g. Tarjeta de Débito NU 4444 1515 3030 1313
        // reduce card balance
        user.getCardByAlias(options.cardOptions.cardAlias).pay(newExpense.total);
    }
    user.addExpense(newExpense);

    // check if user paid a card
    if(user.hasCard(newExpense.category.name)) {
        user.getCardByAlias(newExpense.category.name).addBalance(newExpense.total);
    }

    // check if user paid a loan
    if(user.hasLoan(newExpense.category.name)) {
        user.getLoanByAlias(newExpense.category.name).pay(newExpense.total);
    }

    res.status(200).json({});
});


// todo create endpoint to add balance to savings account and pull money from it

// todo create endpoint to add/remove expenses categories

// todo create endpoint to add/remove cards

// todo create endpoint to update card information (balance, alias)

// todo create endpoint to add/remove loans

export default router;