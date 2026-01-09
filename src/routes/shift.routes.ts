import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { ShiftController } from "../controllers/shift.controller";

const router = Router();

router.use(AuthMiddleware.isCashier);

router.post("/shift/start", ShiftController.startShift);
router.post("/shift/end", ShiftController.closeShift);

export default router;