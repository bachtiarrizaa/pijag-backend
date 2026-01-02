import { Router } from "express";
import { createProductDiscountController } from "../controllers/productDiscount/productDiscount.controller";
import { isAdmin } from "../middleware/auth.middleware";

const router = Router();

router.post("/:productId/discount", isAdmin, createProductDiscountController)

export default router;