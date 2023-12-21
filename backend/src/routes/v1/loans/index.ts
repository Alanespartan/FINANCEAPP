import { MyRouter } from "../../MyRouter";
import { CreditCard, DebitCard } from "../../../lib/cards";
import { CardOptions, CardTypes, UpdateCardOptions } from "@common/types/cards";

const router = new MyRouter();

router.post("/add-loan", (req, res) => {
    const user    = req.userData;
    
    return res.status(200);
});
router.post("/delete-loan/:alias", (req, res) => {
    const user  = req.userData;
    const alias = req.params.alias;
    const index = req.body.index;

    if(!user.hasLoan(alias)) { throw new Error("Loan doesn't exist."); }

    user.removeLoan(index);

    return res.status(200);
});

export default router;