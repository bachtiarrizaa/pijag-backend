import { Router } from "express";
import { isCustomer } from "../middleware/auth.middleware";
import {
    addItemToCartController,
    deleteCartItemController,
    getCartControllers,
    updateCartItemController
} from "../controllers/cart/cart.controller";

const router = Router();

router.use(isCustomer);

router.get("/", getCartControllers);
router.post("/item", addItemToCartController);
router.put("/item/:id", updateCartItemController);
router.delete("/item/:id", deleteCartItemController);

export default router;