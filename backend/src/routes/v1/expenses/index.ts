import { Router } from "express";
import categoriesRouter from "./categories";
import subcategoriesRouter from "./categories";

const router = Router();

router.use("/categories", categoriesRouter);
router.use("/subcategories", subcategoriesRouter);

export default router;
