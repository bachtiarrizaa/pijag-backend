import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { ProductDiscountController } from "../controllers/product-discount.controller";

const router = Router();
router.use(AuthMiddleware.isAdmin);

router.post("/", ProductDiscountController.create);

export default router;