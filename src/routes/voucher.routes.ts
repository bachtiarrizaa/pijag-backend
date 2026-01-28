import Router from "express";
import { VoucherController } from "../controllers/voucher.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", AuthMiddleware.authenticateToken, VoucherController.getVouchers);
router.post("/", AuthMiddleware.isAdmin, VoucherController.create);
router.put("/:id", AuthMiddleware.isAdmin, VoucherController.update);
router.patch("/update-status/:id", AuthMiddleware.isAdmin, VoucherController.updateStatus);
router.delete("/:id", AuthMiddleware.isAdmin, VoucherController.delete);

export default router;