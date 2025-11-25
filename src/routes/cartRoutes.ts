import { Router } from "express";
import { isCustomer } from "../middleware/authMiddleware";
import { addItemToCartController, deleteCartItemControlelr, getCartControllers, updateCartItemControllers } from "../controllers/cart/cartControllers";

const router = Router();

router.use(isCustomer);

router.get("/", getCartControllers);
router.post("/item", addItemToCartController);
router.put("/item/:id", updateCartItemControllers);
router.delete("/item/:id", deleteCartItemControlelr);

export default router;