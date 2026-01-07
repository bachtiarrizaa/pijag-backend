import { Router } from "express";
import authRoutes from "./auth.routes";
import roleRoutes from "./role.routes";
import categoryRoutes from "./category.routes";
import profileRoutes from "./profile.routes";
import discountRoutes from "./discount.routes"
import productRoutes from "./product.routes";
import productDiscountRoutes from "./prouductDiscount.routes";
import cartRoutes from './cart.routes';
import shiftRoutes from "./shift.routes";
import orderRoutes from "./order.routes"

const router = Router();

router.use("/auth", authRoutes);
router.use("/role", roleRoutes);
router.use("/category", categoryRoutes);
router.use("/profile", profileRoutes);
// router.use("/discount", discountRoutes);
router.use("/products", productRoutes);
// router.use("/products", productDiscountRoutes);
// router.use("/cart", cartRoutes);
// router.use("/cashier", shiftRoutes)
// router.use("/order", orderRoutes);

export default router;