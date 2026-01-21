import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { WishlistController } from "../controllers/wishlist.controller";

const router = Router();

router.use(AuthMiddleware.isCustomer);

router.post("/", WishlistController.create);
router.delete("/:id", WishlistController.delete);

export default router;