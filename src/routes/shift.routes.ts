import { Router } from "express";
import { isCashier } from "../middleware/authMiddleware";
import { startShiftControllers, endShiftControllers } from "../controllers/shift/shift.controllers";

const router = Router();

router.use(isCashier);

router.post("/shift/start", startShiftControllers);
router.post("/shift/end", endShiftControllers)

export default router;