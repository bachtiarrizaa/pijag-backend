import Router from "express";
import { authenticateToken, authorizeRole } from "../middleware/auth.middleware";
import { createOrderController } from "../controllers/order/order.controller";

const router = Router();

router.post(
  "/",
  authenticateToken,
  authorizeRole(["customer", "cashier"]),
  createOrderController
);

export default router;