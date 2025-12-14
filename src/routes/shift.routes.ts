import { Router } from "express";
import { isCashier } from "../middleware/auth.middleware";
import {
    startShiftController,
    endShiftController
} from "../controllers/shift/shift.controller";

const router = Router();

router.use(isCashier);

router.post("/shift/start", startShiftController);
router.post("/shift/end", endShiftController)

export default router;