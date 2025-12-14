import { Router } from "express";
import authRoutes from "./auth.routes";
import categoryRoutes from "./categoryRoutes";
import productRoutes from "./productRoutes";
import cartRoutes from './cartRoutes';
import shiftRoutes from "./shift.routes"

const router = Router();

router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes)
router.use("/cart", cartRoutes);
router.use("/cashier", shiftRoutes)

export default router;