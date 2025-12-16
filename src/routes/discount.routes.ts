import Router from "express";
import { createDiscountController, deleteDiscountController, getDiscountController, updateDiscountController } from "../controllers/discount/discount.controller";
import { isAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", isAdmin, getDiscountController);
router.post("/", isAdmin, createDiscountController);
router.put("/:id", isAdmin, updateDiscountController);
router.delete("/:id", isAdmin, deleteDiscountController);

export default router;