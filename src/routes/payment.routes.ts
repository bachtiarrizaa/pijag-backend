import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();

router.post("/", AuthMiddleware.authenticateToken, PaymentController.create);

export default router;