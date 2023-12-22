import { randomUUID } from "crypto";
import { MyRouter } from "../../MyRouter";
import { Expense, PaymentConfig, PaymentMethod } from "@common/types/payments";

const router = new MyRouter();

router.post("/add-payment", (req, res) => {
    const user    = req.userData;
    const options = req.body.options as PaymentConfig;
    
    // create expense record
    const newExpense = {
        id:          randomUUID(),
        total:       options.total,
        category:    options.category,
        paymentDate: new Date(),
        comment:     options.comment
    } as Expense;
    newExpense.method.type = options.method;
    if(options.method === PaymentMethod.CASH) {
        newExpense.method.name = options.method;
        // reduce cash balance
        user.decreaseCash(newExpense.total);
    } else if(options.method === PaymentMethod.CARD && options.cardOptions) {
        if(!user.hasCard(options.cardOptions.cardAlias)) { throw new Error(`${options.cardOptions.cardAlias} doesn't exist in user information.`); }
        newExpense.method.name = options.cardOptions.cardAlias; // e.g. Tarjeta de Débito NU 4444 1515 3030 1313
        // reduce card balance
        user.getCard(false, options.cardOptions.cardAlias).pay(newExpense.total);
    }
    user.addExpense(newExpense);

    // check if user paid a card
    if(user.hasCard(newExpense.category.alias)) {
        user.getCard(false, newExpense.category.alias).addBalance(newExpense.total);
    }

    // check if user paid a loan
    if(user.hasLoan(newExpense.category.alias)) {
        user.getLoan(false, newExpense.category.alias).pay(newExpense.total);
    }

    return res.status(200);
});

// todo create endpoint to add balance to savings account and pull money from it

export default router;