import { MyRouter } from "../../MyRouter";
import { ExpenseCategory } from "@common/types/payments";

const router = new MyRouter();

router.post("/add-categories", (req, res) => {
    const user       = req.userData;
    const categories = req.body.options as ExpenseCategory[];

    for(const category of categories) user.addCategory(category);

    return res.status(200);
});

router.post("/delete-categories", (req, res) => {
    const user       = req.userData;
    const categories = req.body.options as string[];

    for(const category of categories) {
        if(!user.hasCategory(category)) { throw new Error(`${category} doesn't exist.`); }
        user.removeCategory(user.getCategoryIndex(category));
    }

    return res.status(200);
});

export default router;