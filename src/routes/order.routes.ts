import Router from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { OrderController } from "../controllers/order.controller";
// import { authenticateToken, authorizeRole } from "../middleware/auth.middleware";
// import { createOrderController } from "../controllers/order/order.controller";

const router = Router();

router.post(
  "/",
  AuthMiddleware.authenticateToken,
  AuthMiddleware.authorizeRole(["customer", "cashier"]),
  OrderController.create
);

export default router;