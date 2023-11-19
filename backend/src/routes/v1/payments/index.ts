import { MyRouter } from "../../MyRouter";
import { CardOptions }             from "@common/types/cards";
import { CardTypes }               from "@common/types/cards";
import { Expense, PaymentConfig, PaymentMethod } from "@common/types/payments";
import { randomUUID }              from "crypto";

const router = new MyRouter();

router.post("/user-payment", (req, res) => {
    const user    = req.session.userData;
    const options = req.body.options as PaymentConfig;
    if(!user) throw new Error("User data not found");
    
    const newExpense = {
        id:          randomUUID(),
        total:       options.total,
        category:    options.category,
        paymentDate: new Date(),
        comment:     options.comment
    } as Expense;
    newExpense.method.type = options.method;

    if(options.method === PaymentMethod.CASH) {
        newExpense.method.name = "Cash";
    } else if(options.method === PaymentMethod.CARD && options.cardOptions) {
        const exists = user.hasCard(options.cardOptions.cardAlias);
        if(exists < 0) { throw new Error(`${options.cardOptions.cardAlias} doesn't exist in user information.`); }
        newExpense.method.name = options.cardOptions.cardAlias;
    }

    user.doPayment(newExpense);
});


// todo create endpoint to add balance to savings account and pull money from it

// todo create endpoint to add/remove expenses categories

// todo create endpoint to add/remove cards

// todo create endpoint to update card information (balance, alias)

// todo create endpoint to add/remove loans

export default router;