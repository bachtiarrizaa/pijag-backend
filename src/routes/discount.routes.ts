import Router from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { DiscountController } from "../controllers/discount.controller";

const router = Router();
router.use(AuthMiddleware.isAdmin)

router.get("/", DiscountController.getDiscounts);
router.post("/", DiscountController.create);
router.put("/:id", DiscountController.update);
router.delete("/:id", DiscountController.delete);

export default router;