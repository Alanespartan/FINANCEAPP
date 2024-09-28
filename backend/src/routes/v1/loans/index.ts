import { Router } from "express";

const router = Router();

router.post("/add-loan", (req, res) => {
    // const user = req.userData;

    /**
     * user.addCategory({
        id:        randomUUID(),
        alias:     newCard.getAlias(),
        isDefault: false
    } as ExpenseCategory);
     */

    return res.status(200);
});

router.post("/delete-loan/:alias", (req, res) => {
    const user  = req.userData;
    const alias = req.params.alias;

    if(!user.hasLoan(alias)) { throw new Error("Loan doesn't exist."); }

    user.removeLoan(user.getCardIndex(alias));

    return res.status(200);
});

export default router;
