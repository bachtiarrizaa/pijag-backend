import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { ProductDiscountController } from "../controllers/product-discount.controller";

const router = Router();
router.use(AuthMiddleware.isAdmin);

router.get("/", ProductDiscountController.getProductDiscounts);
router.post("/", ProductDiscountController.create);
router.put("/:id", ProductDiscountController.update);
router.delete("/:id", ProductDiscountController.delete);

export default router;