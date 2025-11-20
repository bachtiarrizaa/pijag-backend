import { Router } from "express";
import { registerControllers } from "../controllers/auth/registerControllers";
import { loginControllers } from "../controllers/auth/loginControllers";
import { authenticateToken } from "../middleware/authMiddleware";
import { logoutController } from "../controllers/auth/logoutController";

const router = Router();

router.post("/register", registerControllers);
router.post("/login", loginControllers);
router.post("/logout", authenticateToken, logoutController)

export default router;