import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { CartController } from "../controllers/cart.controller";

const router = Router();

router.use(AuthMiddleware.isCustomer);

router.get("/", CartController.getCart);
router.post("/item", CartController.addItem);
router.put("/item/:id", CartController.updateItem);
router.delete("/item/:id", CartController.delete);

export default router;