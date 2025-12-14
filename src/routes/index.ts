import { Router } from "express";
import authRoutes from "./auth.routes";
import categoryRoutes from "./category.routes";
import productRoutes from "./productRoutes";
import cartRoutes from './cart.routes';
import shiftRoutes from "./shift.routes"

const router = Router();

router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes)
router.use("/cart", cartRoutes);
router.use("/cashier", shiftRoutes)

export default router;