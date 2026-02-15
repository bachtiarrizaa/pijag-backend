import Router from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { OrderController } from "../controllers/order.controller";

const router = Router();

router.get("/", AuthMiddleware.authenticateToken, OrderController.getOrders);
router.post(
  "/",
  AuthMiddleware.authenticateToken,
  AuthMiddleware.authorizeRole(["customer", "cashier"]),
  OrderController.create
);
router.patch(
  "/:id/status",
  AuthMiddleware.authenticateToken,
  AuthMiddleware.authorizeRole(["admin", "cashier"]),
  OrderController.updateOrderStatus
);
router.patch(
  "/:id/cancel",
  AuthMiddleware.authenticateToken,
  OrderController.cancelOrder
);

export default router;